// Test script for the Redis worker system
// Run with: node scripts/test-worker.js

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function testWorker() {
    console.log('🧪 Testing Redis Worker System...\n');

    // Test 1: Add some sample events to the queue
    console.log('1️⃣ Adding sample events to Redis queue...');
    
    const sampleEvents = [
        {
            type: 'EMAIL_DELIVERED',
            campaignId: 'test-campaign-1',
            recipient: 'user1@example.com',
            timestamp: Date.now()
        },
        {
            type: 'EMAIL_OPENED',
            campaignId: 'test-campaign-1',
            recipient: 'user1@example.com',
            timestamp: Date.now()
        },
        {
            type: 'EMAIL_CLICKED',
            campaignId: 'test-campaign-1',
            recipient: 'user1@example.com',
            url: 'https://example.com',
            timestamp: Date.now()
        },
        {
            type: 'NEW_USER_EMAIL',
            email: 'newuser@example.com',
            name: 'New User',
            group: 'newsletter',
            timestamp: Date.now()
        }
    ];

    for (const event of sampleEvents) {
        try {
            const response = await fetch(`${BASE_URL}/api/email/webhook`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event)
            });
            
            if (response.ok) {
                console.log(`✅ Queued: ${event.type}`);
            } else {
                console.log(`❌ Failed to queue: ${event.type}`);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.log(`❌ Error queuing ${event.type}:`, errorMessage);
        }
    }

    // Test 2: Check queue status
    console.log('\n2️⃣ Checking queue status...');
    try {
        const response = await fetch(`${BASE_URL}/api/worker`);
        if (response.ok) {
            const stats = await response.json();
            console.log(`📊 Queue length: ${stats.queueLength}`);
            console.log(`📋 Sample events: ${stats.sampleEvents.length}`);
        } else {
            console.log('❌ Failed to get queue stats');
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log('❌ Error checking queue:', errorMessage);
    }

    // Test 3: Process events
    console.log('\n3️⃣ Processing events...');
    try {
        const response = await fetch(`${BASE_URL}/api/worker`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ limit: 10 })
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log(`✅ Processed: ${result.processed} events`);
            if (result.errors && result.errors.length > 0) {
                console.log(`⚠️  Errors: ${result.errors.length}`);
                result.errors.forEach((error) => console.log(`   - ${String(error)}`));
            }
        } else {
            console.log('❌ Failed to process events');
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log('❌ Error processing events:', errorMessage);
    }

    // Test 4: Check final queue status
    console.log('\n4️⃣ Final queue status...');
    try {
        const response = await fetch(`${BASE_URL}/api/worker`);
        if (response.ok) {
            const stats = await response.json();
            console.log(`📊 Final queue length: ${stats.queueLength}`);
        } else {
            console.log('❌ Failed to get final queue stats');
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log('❌ Error checking final queue:', errorMessage);
    }

    console.log('\n🎉 Test completed!');
}

// Run the test
testWorker().catch((error) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Test failed:', errorMessage);
});

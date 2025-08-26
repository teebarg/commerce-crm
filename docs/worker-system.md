# Redis Worker System

The Redis Worker System is a serverless function-based queue processing system that handles email events and other asynchronous tasks.

## Overview

Instead of directly updating the database when email events occur (opens, clicks, deliveries), the system queues these events in Redis and processes them asynchronously using a worker function. This approach provides:

- **Better performance**: Email tracking endpoints respond faster
- **Reliability**: Failed events can be retried
- **Scalability**: Multiple workers can process events in parallel
- **Monitoring**: Queue status and processing metrics are available

## Architecture

```
Email Tracking Endpoints → Redis Queue → Worker Function → Database
     (Fast Response)         (Persistent)    (Async)      (Updates)
```

## Components

### 1. Redis Queue (`email_events`)

Events are stored as JSON strings in a Redis list with the key `email_events`. Each event contains:

```json
{
  "id": "uuid",
  "type": "EMAIL_OPENED|EMAIL_CLICKED|EMAIL_DELIVERED",
  "campaignId": "campaign-uuid",
  "recipient": "user@example.com",
  "timestamp": 1234567890,
  "url": "https://example.com", // for clicks
  "email": "new@example.com",   // for new users
  "name": "User Name",          // for new users
  "group": "newsletter"         // for new users
}
```

### 2. Worker Function (`/api/worker`)

**POST** - Processes events from the queue
- Processes up to `limit` events (default: 50)
- Removes processed events from the queue
- Returns processing results and any errors

**GET** - Returns queue status
- Current queue length
- Sample of first 5 events

### 3. Event Types

- **EMAIL_DELIVERED**: Email was delivered to recipient
- **EMAIL_OPENED**: Email was opened (tracking pixel)
- **EMAIL_CLICKED**: Email link was clicked

## Usage

### Adding Events to Queue

```typescript
import { queueEmailEvent } from "@/lib/redis";

// Queue an email opened event
await queueEmailEvent({
    type: "EMAIL_OPENED",
    campaignId: "campaign-123",
    recipient: "user@example.com",
    timestamp: Date.now()
});
```

### Processing Events

```bash
# Process up to 50 events
curl -X POST /api/worker \
  -H "Content-Type: application/json" \
  -d '{"limit": 50}'

# Check queue status
curl /api/worker
```

### Manual Processing

The Worker Dashboard (`/admin/worker`) provides a UI for:
- Viewing queue status
- Manually processing events
- Monitoring processing results
- Viewing sample events in the queue

## Configuration

### Environment Variables

```bash
REDIS_URL=redis://localhost:6379
# or for Redis Cloud/remote instances:
# REDIS_URL=redis://:password@host:port
```

### Redis Commands Used

- `RPUSH`: Add events to queue
- `LLEN`: Get queue length
- `LRANGE`: Get events from queue
- `LREM`: Remove processed events

## Error Handling

- Failed events are logged but don't block processing
- Events with parsing errors are skipped
- Database errors are captured and reported
- The worker continues processing even if individual events fail

## Monitoring

### Queue Metrics

- Queue length
- Processing rate
- Error count
- Event types distribution

### Health Checks

- Redis connectivity
- Database connectivity
- Worker function availability

## Testing

Use the test script to verify the system:

```bash
node scripts/test-worker.js
```

This will:
1. Add sample events to the queue
2. Check queue status
3. Process events
4. Verify final queue state

## Deployment

### Vercel

The worker function is automatically deployed as a serverless function on Vercel.

### Cron Jobs

For production, consider setting up a cron job to regularly call the worker:

```bash
# Process events every 5 minutes
*/5 * * * * curl -X POST https://your-domain.com/api/worker
```

### Multiple Workers

Multiple worker instances can run simultaneously:
- Each processes a subset of events
- Redis ensures no duplicate processing
- Scale horizontally as needed

## Troubleshooting

### Common Issues

1. **Redis Connection Failed**
   - Check `REDIS_URL` environment variable
   - Verify Redis instance is running and accessible

2. **Database Errors**
   - Check database connectivity
   - Verify schema matches expected data

3. **Queue Not Processing**
   - Check worker function logs
   - Verify Redis queue has events
   - Check function permissions

### Debug Mode

Enable debug logging by setting:

```bash
DEBUG=worker:*
```

## Future Enhancements

- **Dead Letter Queue**: Failed events that can't be processed
- **Retry Logic**: Automatic retry for failed events
- **Event Prioritization**: Process high-priority events first
- **Batch Processing**: Optimize database operations
- **Metrics Dashboard**: Real-time processing analytics

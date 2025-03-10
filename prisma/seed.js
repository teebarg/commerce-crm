import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // Clear existing data (optional, for a fresh seed)
    await prisma.payment.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.review.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.shippingFee.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.address.deleteMany();
    await prisma.coupon.deleteMany();
    await prisma.user.deleteMany();

    console.log("Seed data deleted");
    console.log("Beginning seed...");

    // Seed Users
    const user1 = await prisma.user.create({
        data: {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: "hashedpassword123", // In a real app, hash this
            role: "CUSTOMER",
            status: "ACTIVE",
        },
    });

    const user2 = await prisma.user.create({
        data: {
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@example.com",
            password: "hashedpassword456", // In a real app, hash this
            role: "ADMIN",
            status: "ACTIVE",
        },
    });

    // Seed Admin
    await prisma.user.create({
        data: {
            firstName: "Admin",
            lastName: "Admin",
            email: "admin@admin.com",
            password: "$argon2id$v=19$m=65536,t=3,p=4$SR/G7HssPFqoYMmg0/cAkA$0yf3z8z6EC2rBwO5XhntbPNSpGxUpd4q89tu/0uYfLA", // In a real app, hash this
            role: "ADMIN",
            status: "ACTIVE",
        },
    });

    // Seed Addresses
    const address1 = await prisma.address.create({
        data: {
            user_id: user1.id,
            address_1: "123 Main St",
            city: "New York",
            state: "NY",
            postal_code: "10001",
        },
    });

    const address2 = await prisma.address.create({
        data: {
            user_id: user2.id,
            address_1: "456 Oak Ave",
            city: "Los Angeles",
            state: "CA",
            postal_code: "90001",
        },
    });

    // Seed Shipping Fees
    await prisma.shippingFee.createMany({
        data: [
            {
                type: "STANDARD",
                amount: 2500.0,
            },
            {
                type: "EXPRESS",
                amount: 5000.0,
            },
            {
                type: "PICKUP",
                amount: 0.0,
            },
        ],
        skipDuplicates: true,
    });

    // Seed Categories
    const category1 = await prisma.category.create({
        data: {
            name: "Electronics",
            slug: "electronics",
        },
    });

    const category2 = await prisma.category.create({
        data: {
            name: "Clothing",
            slug: "clothing",
        },
    });

    // Seed Tags
    const tag1 = await prisma.tag.create({
        data: {
            name: "Trending",
            slug: "trending",
        },
    });

    const tag2 = await prisma.tag.create({
        data: {
            name: "Latest",
            slug: "latest",
        },
    });

    // Seed Products
    const product1 = await prisma.product.create({
        data: {
            name: "Smartphone",
            slug: "smartphone",
            sku: "SMART123",
            description: "A high-end smartphone",
            categories: {
                connect: [{ id: category1.id }],
            },
            tags: {
                connect: [{ id: tag1.id }],
            },
        },
    });

    const product2 = await prisma.product.create({
        data: {
            name: "T-Shirt",
            slug: "t-shirt",
            sku: "TSHIRT123",
            description: "A comfy cotton t-shirt",
            categories: {
                connect: [{ id: category2.id }],
            },
            tags: {
                connect: [{ id: tag2.id }],
            },
        },
    });

    // Seed Product Variants
    const variant1 = await prisma.productVariant.create({
        data: {
            product_id: product1.id,
            name: "Smartphone 128GB",
            slug: "smartphone-128gb",
            sku: "SMART128GB",
            price: 699.99,
            inventory: 50,
        },
    });

    const variant2 = await prisma.productVariant.create({
        data: {
            product_id: product2.id,
            name: "T-Shirt Large",
            slug: "t-shirt-large",
            sku: "TSHIRT123",
            price: 19.99,
            inventory: 100,
        },
    });

    // Seed Images
    await prisma.productImage.createMany({
        data: [
            {
                url: "https://example.com/smartphone.jpg",
                product_id: product1.id,
            },
            {
                url: "https://example.com/tshirt.jpg",
                product_id: product2.id,
            },
        ],
        skipDuplicates: true,
    });

    // Seed Favorites
    await prisma.favorite.createMany({
        data: [
            {
                user_id: user1.id,
                product_id: product1.id,
            },
            {
                user_id: user2.id,
                product_id: product2.id,
            },
        ],
        skipDuplicates: true,
    });

    // Seed Reviews
    await prisma.review.create({
        data: {
            comment: "Great phone!",
            rating: 5,
            user_id: user1.id,
            product_id: product1.id,
        },
    });

    // Seed Coupons
    const coupon1 = await prisma.coupon.create({
        data: {
            code: "SAVE10",
            discount_type: "PERCENTAGE",
            discount_value: 10.0,
            expiration_date: new Date("2025-12-31"),
        },
    });

    // Seed Cart
    const cart1 = await prisma.cart.create({
        data: {
            user_id: user1.id,
            status: "ACTIVE",
            items: {
                create: [
                    {
                        variant_id: variant1.id,
                        quantity: 1,
                        price: 699.99,
                        image: "https://example.com/smartphone.jpg",
                    },
                ],
            },
        },
    });

    const cart2 = await prisma.cart.create({
        data: {
            user_id: user2.id,
            status: "ACTIVE",
            items: {
                create: [
                    {
                        variant_id: variant1.id,
                        quantity: 2,
                        price: 1699.99,
                        image: "https://example.com/smartphone.jpg",
                    },
                ],
            },
        },
    });

    // Seed Order
    const order1 = await prisma.order.create({
        data: {
            order_number: "ORD12345",
            user_id: user1.id,
            shipping_address_id: address1.id,
            billing_address_id: address1.id,
            total: 719.98,
            subtotal: 699.99,
            tax: 19.99,
            status: "PENDING",
            shipping_method: "STANDARD",
            shipping_fee: 0.0,
            coupon_id: coupon1.id,
            cart_id: cart1.id,
            order_items: {
                create: [
                    {
                        variant_id: variant1.id,
                        quantity: 1,
                        price: 699.99,
                    },
                    {
                        variant_id: variant2.id,
                        quantity: 4,
                        price: 1699.99,
                    },
                ],
            },
        },
    });
    const order2 = await prisma.order.create({
        data: {
            order_number: "ORD12346",
            user_id: user1.id,
            shipping_address_id: address2.id,
            billing_address_id: address2.id,
            total: 719.98,
            subtotal: 699.99,
            tax: 19.99,
            status: "PENDING",
            shipping_method: "STANDARD",
            shipping_fee: 0.0,
            coupon_id: coupon1.id,
            cart_id: cart2.id,
            order_items: {
                create: [
                    {
                        variant_id: variant1.id,
                        quantity: 1,
                        price: 699.99,
                    },
                ],
            },
        },
    });

    // Seed Payment
    await prisma.payment.createMany({
        data: [
            {
                order_id: order1.id,
                amount: 719.98,
                payment_method: "CREDIT_CARD",
                transaction_id: "TXN123456",
            },
            {
                order_id: order2.id,
                amount: 2719.98,
                payment_method: "BANK_TRANSFER",
                transaction_id: "TXN123457",
            },
        ],
        skipDuplicates: true,
    });

    console.log("✅ Database Seeding complete!");
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(() => void prisma.$disconnect());

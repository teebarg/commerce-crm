import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    const hash = await argon2.hash("password");

    await prisma.user.createMany({
        data: [
            { id: "cm7axfsps1292k8r37s2rt43n", email: "user1@example.com", firstName: "Elon", lastName: "Musk", password: hash, status: "PENDING" },
            { id: "cm7axfsps5023k8r37s2rt43n", email: "user2@example.com", firstName: "John", lastName: "Newton", password: hash, status: "INACTIVE" }
        ],
        skipDuplicates: true,
    });

    // Create default platforms
    await prisma.platform.createMany({
        data: [
            { name: "instagram" },
            { name: "twitter" },
            { name: "facebook" },
            { name: "tiktok" },
        ],
        skipDuplicates: true,
    });

    console.log("✅ Seeding complete!");
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(() => void prisma.$disconnect());

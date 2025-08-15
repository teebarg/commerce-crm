import { NextResponse } from "next/server";
import { env } from "@/env";
import { db } from "@/server/db";

export async function GET() {
    try {
        let dbStatus = "unknown";
        try {
            await db.user.count();
            dbStatus = "ok";
        } catch (error) {
            console.log(error)
            dbStatus = "unavailable";
        }

        const healthcheck = {
            status: "ok",
            db: dbStatus,
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: env.NODE_ENV,
            version: process.version,
        };

        return NextResponse.json(healthcheck, { status: dbStatus === "ok" ? 200 : 500 });
    } catch (error) {
        return NextResponse.json(
            {
                status: "error",
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : "An unexpected error occurred",
            },
            { status: 500 }
        );
    }
}

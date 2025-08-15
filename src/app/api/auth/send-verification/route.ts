export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { env } from "@/env";
import { createTransport } from "nodemailer";
import { renderEmail } from "@/utils/email";
import handlebars from "handlebars";

export async function POST(req: Request) {
	console.log("🚀 ~ file: send-verification.ts:10 ~ req:", req)
	try {
		const secret = req.headers.get("x-auth-secret");
		if (!secret || secret !== env.AUTH_SECRET) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { email, url } = (await req.json()) as { email: string; url: string };
		if (!email || !url) {
			return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
		}

		const transport = createTransport({
			host: env.EMAIL_SERVER,
			port: env.EMAIL_SERVER_PORT,
			secure: true,
			auth: {
				user: env.EMAIL_SERVER_USER,
				pass: env.EMAIL_SERVER_PASSWORD,
			},
		});

		const emailHtml = await renderEmail("magic-link", { magic_link_url: url });

		const textTemplate = handlebars.compile(`
Sign in to your account

Click this link to sign in:
{{url}}

This link will expire in 24 hours and can only be used once.
If you didn't request this email, you can safely ignore it.

---
{{appName}} Team
`);
		const emailText = textTemplate({ url, appName: env.APP_NAME });

		await transport.sendMail({
			to: email,
			from: env.EMAIL_FROM,
			subject: "Sign in to your account",
			text: emailText,
			html: emailHtml,
		});

		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error("send-verification error", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}



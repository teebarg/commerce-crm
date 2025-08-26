import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import { env } from "@/env";
import { type Settings } from "@/schemas/notification.schema";
import { currency } from "@/lib/utils";

interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
}

const transporter = nodemailer.createTransport({
    host: env.EMAIL_SERVER,
    port: env.EMAIL_SERVER_PORT,
    secure: true,
    auth: {
        user: env.EMAIL_SERVER_USER,
        pass: env.EMAIL_SERVER_PASSWORD,
    },
});

export async function sendEmail(options: SendEmailOptions) {
    try {
        const mailOptions = {
            from: env.EMAIL_FROM ?? env.EMAIL_SERVER_USER,
            to: options.to ?? env.EMAIL_SERVER_USER,
            subject: options.subject,
            html: options.html,
        } as const;

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email.");
    }
}

export async function renderEmail(templateName: string, settings: Settings,  data: Record<string, any>) {
    const mainLayoutPath = path.join(process.cwd(), "src/templates", "base.hbs");
    const contentTemplatePath = path.join(process.cwd(), "src/templates", `${templateName}.hbs`);

    handlebars.registerHelper("substring", function (str, start, length) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return str.substring(start, start + length);
    });

    handlebars.registerHelper("currency", function (price) {
        return currency(price);
    });

    handlebars.registerHelper("url", function (path) {
        return process.env.NEXT_PUBLIC_SHOP_FRONTEND + path;
    });

    handlebars.registerHelper("chunk", function (arr: any[], size: number, options: any) {
        let out = "";
        for (let i = 0; i < arr.length; i += size) {
            // `arr.slice(i, i + size)` = a group
            out += options.fn(arr.slice(i, i + size));
        }
        return out;
    });

    const emailData = {
        ...data,
        year: new Date().getFullYear(),
        app_name: env.APP_NAME,
        base_url: env.BASE_URL,
        socialLinks: {
            facebook: `https://www.facebook.com/${settings.socialLinks.facebook}`,
            instagram: `https://www.instagram.com/${settings.socialLinks.instagram}`,
            twitter: `https://www.x.com/${settings.socialLinks.twitter}`,
        },
        supportLink: settings.supportLink,
        unsubscribeLink: settings.unsubscribeLink,
        preferencesLink: settings.preferencesLink,
        companyName: settings.companyName,
        companyAddress: settings.companyAddress,
        companyPhone: settings.companyPhone,
        contactEmail: env.NEXT_PUBLIC_CONTACT_EMAIL,
    };

    const mainTemplate = handlebars.compile(fs.readFileSync(mainLayoutPath, "utf8"));
    const contentTemplate = handlebars.compile(fs.readFileSync(contentTemplatePath, "utf8"));

    const bodyContent = contentTemplate(emailData);

    return mainTemplate({
        ...emailData,
        body: bodyContent,
    });
}

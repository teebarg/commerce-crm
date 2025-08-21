import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import { env } from "@/env";

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

export async function renderEmail(templateName: string, data: Record<string, any>) {
    const mainLayoutPath = path.join(process.cwd(), "src/templates", "base.hbs");
    const contentTemplatePath = path.join(process.cwd(), "src/templates", `${templateName}.hbs`);

    handlebars.registerHelper("substring", function (str, start, length) {
        return str.substring(start, start + length);
    });

    const emailData = {
        ...data,
        year: new Date().getFullYear(),
        app_name: env.APP_NAME,
        base_url: env.BASE_URL,
        socialLinks: {
            facebook: "https://www.facebook.com",
            instagram: "https://www.instagram.com",
            twitter: "https://www.twitter.com",
        },
        supportLink: "https://www.thriftbyoba.com",
        unsubscribeLink: "https://www.thriftbyoba.com",
        preferencesLink: "https://www.thriftbyoba.com",
        companyName: "ThriftByOba",
        companyAddress: "123 Thrift St, Oba City, Nigeria",
        companyPhone: "+234 123 456 7890",
        contactEmail: env.NEXT_PUBLIC_CONTACT_EMAIL,
        promotion: {
            title: "Special Offer",
            description: "Get 10% off your first purchase",
            discount: 10,
            code: "SAVE10",
            ctaText: "Shop Now",
            ctaLink: "https://www.thriftbyoba.com",
            urgency: "Limited time offer",
        },
        featuredProducts: [
            {
                name: "Product 1",
                price: "100",
                originalPrice: "120",
                imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzSOrIHIncvVwcn86Yj1lG2no3rymRPhF1AQ&s",
                url: "https://www.thriftbyoba.com",
            },
            {
                name: "Product 2",
                price: "200",
                originalPrice: "220",
                imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzSOrIHIncvVwcn86Yj1lG2no3rymRPhF1AQ&s",
                url: "https://www.thriftbyoba.com",
            },
        ],
    };

    const mainTemplate = handlebars.compile(fs.readFileSync(mainLayoutPath, "utf8"));
    const contentTemplate = handlebars.compile(fs.readFileSync(contentTemplatePath, "utf8"));

    const bodyContent = contentTemplate(emailData);

    return mainTemplate({
        ...emailData,
        body: bodyContent,
    });
}

// import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import { env } from "@/env";

// interface EmailOptions {
//     to: string;
//     subject: string;
//     template: string;
//     context: Record<string, string | number>;
// }

// const transporter = nodemailer.createTransport({
//     host: env.EMAIL_SERVER,
//     port: env.EMAIL_SERVER_PORT,
//     secure: true,
//     auth: {
//         user: env.EMAIL_SERVER_USER,
//         pass: env.EMAIL_SERVER_PASSWORD,
//     },
// });

// export async function sendEmail(options: EmailOptions) {
//     try {
//         const html = await renderEmail(options.template, options.context);

//         const mailOptions = {
//             from: env.EMAIL_FROM,
//             to: options.to ?? env.EMAIL_SERVER_USER,
//             subject: options.subject,
//             html: html,
//         };

//         await transporter.sendMail(mailOptions);
//     } catch (error) {
//         console.error("Error sending email:", error);
//         throw new Error("Failed to send email.");
//     }
// }

export async function renderEmail(templateName: string, data: Record<string, string | number>) {
    const mainLayoutPath = path.join(process.cwd(), "src/templates", "base.hbs");
    const contentTemplatePath = path.join(process.cwd(), "src/templates", `${templateName}.hbs`);

    const mainTemplate = handlebars.compile(fs.readFileSync(mainLayoutPath, "utf8"));
    const contentTemplate = handlebars.compile(fs.readFileSync(contentTemplatePath, "utf8"));

    const bodyContent = contentTemplate(data);

    return mainTemplate({
        ...data,
        body: bodyContent,
        year: new Date().getFullYear(),
        app_name: env.APP_NAME,
        contact_email: env.NEXT_PUBLIC_CONTACT_EMAIL,
        base_url: env.BASE_URL,
    });
}

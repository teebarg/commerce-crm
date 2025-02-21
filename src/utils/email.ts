import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";

// Define the email options interface
interface EmailOptions {
    to: string;
    subject: string;
    template: string;
    context: Record<string, string | number>;
}

// Create a transporter
const transporter = nodemailer.createTransport({
    host: "smtp.zoho.eu",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Function to send an email
export async function sendEmail(options: EmailOptions) {
    try {
        // Read the email template
        const templatePath = path.join(process.cwd(), "src/templates", `${options.template}.html`);
        const templateSource = fs.readFileSync(templatePath, "utf8");

        // Compile the template
        const template = handlebars.compile(templateSource);
        const html = template(options.context);

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: options.to ?? process.env.EMAIL_USER,
            subject: options.subject,
            html: html,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email.");
    }
}

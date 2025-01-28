import nodemailer from "nodemailer";
import { injectable } from "tsyringe";
import LoginRegisterRequest from "../../user/login-register-request.dto";
import { logger } from "../../main";
import jwt from "jsonwebtoken";
import TokenInfo from "../models/token-info.dto";
import BadRequestError from "../error/bad-request.error";
import { EmailContent } from "../models/email-content-dto";

@injectable()
export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === "true", 
            auth: {
                user: process.env.SMTP_USER, 
                pass: process.env.SMTP_PASS, 
            },
        });
    }

    async sendEmail(emailContent: EmailContent): Promise<void> {
        logger.trace(`Sending email to ${emailContent.to}`);

        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_FROM, 
                to: emailContent.to, 
                subject: emailContent.subject, 
                text: emailContent.text, 
            });

            logger.trace(`Email sent to ${emailContent.to}`);
        } catch (error) {
            throw new Error("Failed to send email. Please try again later.");
        }
    }
}

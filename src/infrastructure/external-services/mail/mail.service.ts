import { env } from "@/infrastructure/config/env.config";
import mailLogger from "@/infrastructure/logger/mail.logger";
import {
  PasswordResetEmailTemplate,
  PasswordResetSuccessEmailTemplate,
} from "@/shared/templates/email/password-reset.template";
import { VerificationEmailTemplate } from "@/shared/templates/email/verification.template";
import { EmailVerifiedTemplate } from "@/shared/templates/email/email-verified.template";
import AppException from "@/shared/utils/exception.util";
import nodemailer from "nodemailer";

class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: env.smtpService,
      auth: {
        user: env.smtpUser,
        pass: env.smtpPassword,
      },
    });
  }

  private async sendEmail(
    to: string,
    { subject, html }: { subject: string; html: string }
  ) {
    try {
      const info = await this.transporter.sendMail({
        from: `"${env.appName}" <${env.smtpUser}>`,
        to,
        subject,
        html,
      });

      mailLogger.info(`Email sent successfully`, {
        recipient: to,
        subject,
        messageId: info.messageId,
      });

      return info;
    } catch (error: unknown) {
      mailLogger.error(`Failed to send email`, {
        recipient: to,
        subject,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      throw new AppException(
        `Failed to send email: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        error instanceof AppException ? error.status : 500
      );
    }
  }

  async sendVerificationEmail(email: string, code: string): Promise<void> {
    const emailContent = new VerificationEmailTemplate().generate({
      code,
      email,
    });
    await this.sendEmail(email, emailContent);
  }

  async sendEmailVerifiedConfirmation(email: string): Promise<void> {
    const emailContent = new EmailVerifiedTemplate().generate();
    await this.sendEmail(email, emailContent);
  }

  async sendPasswordResetEmail(email: string, resetCode: string) {
    const emailContent = new PasswordResetEmailTemplate().generate({
      code: resetCode,
      email: email,
    });
    return this.sendEmail(email, emailContent);
  }

  async sendPasswordResetSuccessEmail(email: string) {
    const emailContent = new PasswordResetSuccessEmailTemplate().generate();
    return this.sendEmail(email, emailContent);
  }
}

export default new MailService();

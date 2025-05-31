import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendOTP(email: string, otp: string, type: 'verification' | 'reset-password'): Promise<void> {
    const subject = type === 'verification' ? 'Your Verification OTP Code' : 'Your Password Reset OTP Code';
    const template = type === 'verification' ? 'otp' : 'password-reset-otp';
    
    await this.mailerService.sendMail({
      to: email,
      subject,
      template,
      context: {
        otp,
        type,
      },
    });
  }

  async sendPasswordReset(email: string, resetToken: string): Promise<void> {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Request',
      template: 'password-reset',
      context: {
        resetLink,
      },
    });
  }
} 
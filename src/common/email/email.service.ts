import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from '@modules/users/services/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly appName = 'Task Management';

  constructor(
    private readonly mailerService: MailerService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async sendOTP(email: string, otp: string, type: 'verification' | 'reset-password'): Promise<void> {
    const subject = type === 'verification' ? 'Your Verification OTP Code' : 'Your Password Reset OTP Code';
    const template = type === 'verification' ? 'otp' : 'password-reset-otp';
    
    // Get user name if exists
    const user = await this.usersService.findByEmail(email);
    const name = user?.name || 'User';
    
    await this.mailerService.sendMail({
      to: email,
      subject,
      template,
      context: {
        otp,
        type,
        name,
        appName: this.appName,
      },
      from: `"${this.appName}" <${this.configService.get('MAIL_FROM')}>`,
    });
  }

  async sendPasswordReset(email: string, resetToken: string): Promise<void> {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    // Get user name if exists
    const user = await this.usersService.findByEmail(email);
    const name = user?.name || 'User';
    
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Request',
      template: 'password-reset',
      context: {
        resetLink,
        name,
        appName: this.appName,
      },
      from: `"${this.appName}" <${this.configService.get('MAIL_FROM')}>`,
    });
  }
} 
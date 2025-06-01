import { Injectable, Inject } from '@nestjs/common';
import { UsersService } from '@modules/users/services/users.service';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';

@Injectable()
export class EmailService {
  private readonly appName = 'Task Management';

  constructor(
    @Inject('MAILER_TRANSPORTER') private readonly transporter: nodemailer.Transporter,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  private async compileTemplate(templateName: string, context: any): Promise<string> {
    const templatePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
    const template = fs.readFileSync(templatePath, 'utf-8');
    const compiledTemplate = handlebars.compile(template);
    return compiledTemplate(context);
  }

  async sendOTP(email: string, otp: string, type: 'verification' | 'reset-password'): Promise<void> {
    const subject = type === 'verification' ? 'Your Verification OTP Code' : 'Your Password Reset OTP Code';
    const template = type === 'verification' ? 'otp' : 'password-reset-otp';
    
    // Get user name if exists
    const user = await this.usersService.findByEmail(email);
    const name = user?.name || 'User';
    
    const html = await this.compileTemplate(template, {
      otp,
      type,
      name,
      appName: this.appName,
    });

    await this.transporter.sendMail({
      to: email,
      subject,
      html,
      from: `"${this.appName}" <${this.configService.get('MAIL_FROM')}>`,
    });
  }

  async sendPasswordReset(email: string, resetToken: string): Promise<void> {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    // Get user name if exists
    const user = await this.usersService.findByEmail(email);
    const name = user?.name || 'User';
    
    const html = await this.compileTemplate('password-reset', {
      resetLink,
      name,
      appName: this.appName,
    });

    await this.transporter.sendMail({
      to: email,
      subject: 'Password Reset Request',
      html,
      from: `"${this.appName}" <${this.configService.get('MAIL_FROM')}>`,
    });
  }
} 
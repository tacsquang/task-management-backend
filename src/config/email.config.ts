import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

export const getEmailConfig = (configService: ConfigService): MailerOptions => ({
  transport: {
    host: configService.get('email.host'),
    port: configService.get('email.port'),
    secure: configService.get('email.secure'),
    auth: {
      user: configService.get('email.auth.user'),
      pass: configService.get('email.auth.pass'),
    },
  },
  defaults: {
    from: `"Task Management" <${configService.get('email.auth.user')}>`,
  },
  template: {
    dir: join(__dirname, '..', 'common', 'email', 'templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
}); 
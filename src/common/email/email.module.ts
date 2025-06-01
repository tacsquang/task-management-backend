import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { UsersModule } from '@modules/users/users.module';
import * as nodemailer from 'nodemailer';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
  ],
  providers: [
    {
      provide: 'MAILER_TRANSPORTER',
      useFactory: (configService: ConfigService) => {
        return nodemailer.createTransport({
          host: 'in-v3.mailjet.com',
          port: 587,
          secure: false,
          auth: {
            user: configService.get('MAILJET_API_KEY'),
            pass: configService.get('MAILJET_API_SECRET'),
          },
        });
      },
      inject: [ConfigService],
    },
    EmailService,
  ],
  exports: [EmailService],
})
export class EmailModule {} 
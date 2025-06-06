// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { User } from '@modules/users/entities/user.entity';
import { OTP } from './entities/otp.entity';
import { BlacklistedToken } from './entities/blacklisted-token.entity';
import { OTPService } from './services/otp.service';
import { OTPController } from './controllers/otp.controller';
import { EmailModule } from '@common/email/email.module';
import { UsersModule } from '@modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, OTP, BlacklistedToken]),
    EmailModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: { expiresIn: configService.get('jwt.expiresIn') },
      }),
    }),
  ],
  controllers: [AuthController, OTPController],
  providers: [AuthService, OTPService, JwtStrategy, GoogleStrategy],
  exports: [AuthService, OTPService],
})
export class AuthModule {}

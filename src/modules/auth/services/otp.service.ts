import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OTP, OTPType } from '../entities/otp.entity';
import { EmailService } from '@common/email/email.service';
import { addMinutes } from 'date-fns';
import { User } from '@modules/users/entities/user.entity';

@Injectable()
export class OTPService {
  constructor(
    @InjectRepository(OTP)
    private readonly otpRepository: Repository<OTP>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
  ) {}

  private generateOTP(): string {
    // Generate 6 digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async createAndSendOTP(email: string, type: OTPType, userId?: string): Promise<void> {
    // Check if user exists
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (type === OTPType.VERIFICATION && user) {
      throw new BadRequestException('Email already registered');
    }
    
    if (type === OTPType.RESET_PASSWORD && !user) {
      throw new BadRequestException('Email not found');
    }

    // Delete any existing unused OTPs for this email and type
    await this.otpRepository.delete({
      email,
      type,
      isUsed: false,
    });

    const otp = this.generateOTP();
    const expiresAt = addMinutes(new Date(), 5); // OTP expires in 5 minutes

    await this.otpRepository.save({
      code: otp,
      type,
      email,
      expiresAt,
      userId: user?.id,
    });

    await this.emailService.sendOTP(email, otp, type);
  }

  async verifyOTP(email: string, code: string, type: OTPType): Promise<boolean> {
    const otp = await this.otpRepository.findOne({
      where: {
        email,
        code,
        type,
        isUsed: false,
      },
    });

    if (!otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (new Date() > otp.expiresAt) {
      throw new BadRequestException('OTP has expired');
    }

    // Mark OTP as used
    await this.otpRepository.update(otp.id, { isUsed: true });

    return true;
  }
} 
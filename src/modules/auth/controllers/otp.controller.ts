import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { OTPService } from '../services/otp.service';
import { RequestOTPDto, VerifyOTPDto } from '../dto/otp.dto';
import { OTPType } from '../entities/otp.entity';
import { successResponse } from '@shared/utlis/response.utlis';
import { ApiOperation, ApiTags, ApiBody, ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { BadRequestResponse } from '@shared/swagger/responses.swagger';

@ApiTags('Auth')
@Controller('auth/otp')
export class OTPController {
  constructor(
    private readonly otpService: OTPService,
  ) {}

  @Post('request-verification')
  @ApiOperation({ summary: 'Request verification OTP' })
  @ApiBody({ type: RequestOTPDto })
  @ApiOkResponse({
    description: 'Verification OTP sent successfully',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Verification OTP sent successfully' },
        data: { type: 'object', example: null },
      },
    },
  })
  @BadRequestResponse()
  @HttpCode(HttpStatus.OK)
  async requestVerificationOTP(@Body() dto: RequestOTPDto) {
    await this.otpService.createAndSendOTP(dto.email, OTPType.VERIFICATION);
    return successResponse(null, 'Verification OTP sent successfully');
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify OTP code' })
  @ApiBody({ type: VerifyOTPDto })
  @ApiOkResponse({
    description: 'OTP verified successfully',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'OTP verified successfully' },
        data: { type: 'object', example: null },
      },
    },
  })
  @BadRequestResponse()
  @HttpCode(HttpStatus.OK)
  async verifyOTP(@Body() dto: VerifyOTPDto) {
    await this.otpService.verifyOTP(dto.email, dto.code, OTPType.VERIFICATION);
    return successResponse(null, 'OTP verified successfully');
  }
} 
// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  UnauthorizedException,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '@modules/auth/services/auth.service';
import { LoginDto } from '@modules/auth/dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from '@modules/auth/dto/register.dto';
import { successResponse } from '@shared/utlis/response.utlis';
import {
  ApiOperation,
  ApiTags,
  ApiBody,
  ApiResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiExcludeEndpoint,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { messaging } from 'firebase-admin';
import { BadRequestResponse, UnauthorizedResponse } from '@shared/swagger/responses.swagger';
import { OTPService } from '@modules/auth/services/otp.service';
import { RequestOTPDto, ResetPasswordDto } from '@modules/auth/dto/otp.dto';
import { OTPType } from '@modules/auth/entities/otp.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private otpService: OTPService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'Login successfully',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Login successfully!' },
        data: { type: 'object', example: {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYWViYjA1NC02MDA4LTQ3OTktYTA3Ny0zZjUxYWE3YWIzNWIiLCJlbWFpbCI6InRhY0BnbWFpbC5jb20iLCJpYXQiOjE3NDg2NTAzOTgsImV4cCI6MTc0ODczNjc5OH0.jKEfTRmEovXQtuRJl3vCKEuE_R6Nn6JfaRDHegrMHTc" 
        } },
      },
    },
  })
  @UnauthorizedResponse()
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const data = await this.authService.login(user);
    return successResponse(data, 'Login successfully!');
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Redirect to Google OAuth',
    description: `
      Chuyển hướng người dùng đến trang đăng nhập Google.

      Swagger **không thể xử lý redirect**, vui lòng **mở trực tiếp trong trình duyệt**:

      [http://severdomain/auth/google]
    `,
  })
  @ApiResponse({ status: 302, description: 'Redirect to Google login page' })
  async googleAuth() {
    // Handled by Passport Google Strategy
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Handle Google OAuth callback',
    description: `
      Xử lý dữ liệu trả về từ Google sau khi người dùng đăng nhập.

      Endpoint này được gọi tự động sau khi người dùng xác thực thành công với Google.
    `,
  })
  @ApiOkResponse({
    description: 'Login with Google successfully',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Login successfully!' },
        data: {
          type: 'object',
          example: {
            access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYWViYjA1NC02MDA4LTQ3OTktYTA3Ny0zZjUxYWE3YWIzNWIiLCJlbWFpbCI6InRhY0BnbWFpbC5jb20iLCJpYXQiOjE3NDg2NTAzOTgsImV4cCI6MTc0ODczNjc5OH0.jKEfTRmEovXQtuRJl3vCKEuE_R6Nn6JfaRDHegrMHTc',
          },
        },
      },
    },
  })
  async googleAuthRedirect(@Req() req) {
    const data = await this.authService.handleGoogleLogin(req.user);
    return successResponse(data, 'Login successfully!');
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new account' })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({
    description: 'Register successfully',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 201 },
        message: { type: 'string', example: 'Register successfully!' },
        data: {
          type: 'object',
          example: {
            id: '24242daf-e226-4f4b-a74c-8e62558f4a10',
          },
        },
      },
    },
  })
  @BadRequestResponse()
  async register(@Body() dto: RegisterDto) {
    const data = await this.authService.register(dto);
    return successResponse(data, 'Register successfully', 201);
  }

  @Post('request-reset-password')
  @ApiOperation({ summary: 'Request password reset OTP' })
  @ApiBody({ type: RequestOTPDto })
  @ApiOkResponse({
    description: 'Password reset OTP sent successfully',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Password reset OTP sent successfully' },
        data: { type: 'object', example: null },
      },
    },
  })
  @BadRequestResponse()
  @HttpCode(HttpStatus.OK)
  async requestResetPasswordOTP(@Body() dto: RequestOTPDto) {
    await this.otpService.createAndSendOTP(dto.email, OTPType.RESET_PASSWORD);
    return successResponse(null, 'Password reset OTP sent successfully');
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with OTP' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiOkResponse({
    description: 'Password reset successfully',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Password reset successfully' },
        data: { type: 'object', example: null },
      },
    },
  })
  @BadRequestResponse()
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.otpService.verifyOTP(dto.email, dto.code, OTPType.RESET_PASSWORD);
    await this.authService.resetPassword(dto.email, dto.newPassword);
    return successResponse(null, 'Password reset successfully');
  }
}

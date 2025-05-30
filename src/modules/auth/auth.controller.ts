// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  UnauthorizedException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from './dto/register.dto';
import { successResponse } from '../shared/utlis/response.utlis';
import {
  ApiOperation,
  ApiTags,
  ApiBody,
  ApiResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiExcludeEndpoint,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { messaging } from 'firebase-admin';
import { BadRequestResponse, UnauthorizedResponse } from '../shared/swagger/responses.swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
            "access_token": "adfjsgsdgklasdgjsadjglskd;salkdgj;slkdgj;slkgdsjlsa;fsjag" 
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
            access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
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
            id: '',
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
}

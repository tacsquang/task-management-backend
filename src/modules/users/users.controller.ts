import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { successResponse } from '../shared/utlis/response.utlis';
import { UpdateDeviceTokenDto } from './dto/update-device-token.dto';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { BadRequestResponse, ForbiddenResponse } from '../shared/swagger/responses.swagger';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('me')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy thông tin cá nhân người dùng' })
  @ApiOkResponse({
    description: 'Lấy profile thành công',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Lay profile thanh cong' },
        data: {
          type: 'object',
          example: {
            id: 'user_id_123',
            email: 'user@example.com',
            name: 'Nguyen Van A',
            is_active: true,
            avatar: 'https://example.com/avatar.jpg',
          },
        },
      },
    },
  })
  async getProfile(
    @Req() req,
  ) {

    const data = await this.usersService.findById(req.user.id);
    return successResponse(data, 'Lay profile thanh cong')
  }

  @Patch()
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  @ApiBody({
    type: UpdateUserDto,
    examples: {
      updateProfileExample: {
        value: {
          name: 'Nguyen Van B',
          avatar: 'https://example.com/avatar_new.jpg',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Cập nhật thành công',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Update successful' },
        data: {
          type: 'object',
          example: {
            id: 'user_id_123',
            email: 'user@example.com',
            name: 'Nguyen Van A',
            is_active: true,
            avatar: 'https://example.com/avatar.jpg',
          },
        },
      },
    },
  })
  @BadRequestResponse()
  async updateProfile(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto
  ) {
    console.log(req.user.id);
    const data = await this.usersService.updateProfile(req.user.id, updateUserDto);
    return successResponse(data, 'Update successful')
  }

  // @Post('activate')
  // async activateAccount(
  //   @Req() req,
  // ) {
  //   return this.usersService.sendOtpToEmail(req.id);
  // }

  @Patch('device-token')
  @ApiOperation({ summary: 'Cập nhật device FCM token' })
  @ApiBody({ type: UpdateDeviceTokenDto })
  @ApiOkResponse({
    description: 'Cập nhật device token thành công',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Cập nhật device token thành công' },
        data: {},
      },
    },
  })
  @BadRequestResponse()
  async updateDeviceToken(
    @Req() req,
    @Body() dto: UpdateDeviceTokenDto
  ) {
    const data = await this.usersService.updateDeviceToken(req.user.id, dto.device_fcm_token);
    return successResponse(data, 'Cập nhật device token thành công');
  }

}

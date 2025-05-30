import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { successResponse } from '../shared/utlis/response.utlis';
import { UpdateDeviceTokenDto } from './dto/update-device-token.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('me')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Xem thong tin profile
  // Cap nhat thong tin profile
  // Active account (gui otp ve mail)
  // Cap nhat device_token_fcm

  @Get()
  async getProfile(
    @Req() req,
  ) {

    const data = await this.usersService.findById(req.user.id);
    return successResponse(data, 'Lay profile thanh cong')
  }

  @Patch()
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
  async updateDeviceToken(
    @Req() req,
    @Body() dto: UpdateDeviceTokenDto
  ) {
    const data = await this.usersService.updateDeviceToken(req.user.id, dto.device_fcm_token);
    return successResponse(data, 'Cập nhật device token thành công');
  }

}

import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, NotFoundException, ParseUUIDPipe } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { AuthGuard } from '@nestjs/passport';
import { successResponse } from '../shared/utlis/response.utlis';

@UseGuards(AuthGuard('jwt'))
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  async sendNotification(
    @Body() body: { token: string; title: string; message: string; data?: any },
  ) {
    return this.notificationService.sendPushNotification(
      body.token,
      body.title,
      body.message,
      body.data,
    );
  }

  @Get()
  async getUserNotifications(@Req() req) {
    const notifications = await this.notificationService.getUserNotifications(req.user.id);
    return successResponse({ notifications }, 'thanh cong');
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req,
  ) {
    await this.notificationService.markAsRead(id, req.user.id);
    return successResponse([], 'Da danh dau la da doc'); 
  }

}

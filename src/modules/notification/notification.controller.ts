import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, NotFoundException, ParseUUIDPipe } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { AuthGuard } from '@nestjs/passport';
import { successResponse } from '../shared/utlis/response.utlis';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, } from '@nestjs/swagger';
import { ForbiddenResponse, NotFoundResponse } from '../shared/swagger/responses.swagger';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách thông báo của người dùng hiện tại' })
  @ApiOkResponse({
    description: 'Lấy danh sách thành công',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Lấy danh sách thông báo thành công' },
        data: {
          type: 'object',
          properties: {
            notifications: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: 'notification_id_123' },
                  title: { type: 'string', example: 'Bạn có một task mới' },
                  content: { type: 'string', example: 'Task ABC đã được giao cho bạn' },
                  is_read: { type: 'boolean', example: false },
                  created_at: { type: 'string', format: 'date-time', example: '2025-05-30T12:00:00.000Z' },
                },
              },
            },
          },
        },
      },
    },
  })
  async getUserNotifications(@Req() req) {
    const notifications = await this.notificationService.getUserNotifications(req.user.id);
    return successResponse({ notifications }, 'thanh cong');
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Đánh dấu thông báo là đã đọc' })
  @ApiOkResponse({
    description: 'Đánh dấu thành công',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Đã đánh dấu là đã đọc' },
        data: {
          type: 'array',
          example: [],
        },
      },
    },
  })
  @NotFoundResponse()
  @ForbiddenResponse()
  async markAsRead(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req,
  ) {
    await this.notificationService.markAsRead(id, req.user.id);
    return successResponse([], 'Da danh dau la da doc'); 
  }

}

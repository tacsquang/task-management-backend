import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, NotFoundException, ParseUUIDPipe, Query } from '@nestjs/common';
import { NotificationService } from '@modules/notification/services/notification.service';
import { AuthGuard } from '@nestjs/passport';
import { successResponse } from '@shared/utlis/response.utlis';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ForbiddenResponse, NotFoundResponse } from '@shared/swagger/responses.swagger';
import { PaginationDto } from '@shared/dto/pagination.dto';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of notifications for current user' })
  @ApiOkResponse({
    description: 'Successfully retrieved notifications',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Successfully retrieved notifications' },
        data: {
          type: 'object',
          properties: {
            notifications: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: 'notification_id_123' },
                  title: { type: 'string', example: 'You have a new task' },
                  message: { type: 'string', example: 'Task ABC has been assigned to you' },
                  is_read: { type: 'boolean', example: false },
                  created_at: { type: 'string', format: 'date-time', example: '2025-05-30T12:00:00.000Z' },
                  sent_at: { type: 'string', format: 'date-time', example: '2025-05-30T07:24:40.010Z'},
                  task_id: { type: 'string', example: '91ada0b3-4820-4f4f-bfbd-ce072825ca76'}
                },
              },
            },
            pagination: {
              type: 'object',
              properties: {
                total: { type: 'number', example: 100 },
                page: { type: 'number', example: 1 },
                limit: { type: 'number', example: 10 },
                totalPages: { type: 'number', example: 10 },
              },
            },
          },
        },
      },
    },
  })
  async getUserNotifications(@Req() req, @Query() pagination: PaginationDto) {
    const result = await this.notificationService.getUserNotifications(req.user.id, pagination);
    return successResponse(result, 'Success');
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Notification ID',
  })
  @ApiOkResponse({
    description: 'Successfully marked notification as read',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Successfully marked notification as read' },
        data: { type: 'object', example: null },
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
    return successResponse(null, 'Successfully marked notification as read'); 
  }
}

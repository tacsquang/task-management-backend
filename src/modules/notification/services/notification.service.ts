import { ForbiddenException, Injectable, NotFoundException, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '@modules/notification/entities/notification.entity';
import { NotificationDto } from '@modules/notification/dto/notification.dto';
import { PaginationDto } from '@shared/dto/pagination.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
  ) {}

  async sendPushNotification(token: string, title: string, body: string, data?: any) {
    if (!token) {
      console.warn('No FCM token provided');
      return { success: false, error: 'No FCM token provided' };
    }

    const message: admin.messaging.Message = {
      notification: {
        title,
        body,
      },
      token,
      data: data || {},
      android: {
        priority: 'high' as const,
        notification: {
          channelId: 'default',
          priority: 'high' as const,
          defaultSound: true,
          defaultVibrateTimings: true,
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    try {
      const response = await this.firebaseAdmin.messaging().send(message);
      console.log('Successfully sent message:', response);
      return { success: true, response };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error };
    }
  }

  async createNotification(input: {
    userId: string;
    taskId?: string;
    title: string;
    message: string;
    fcmToken?: string;
  }): Promise<void> {
    const notification = this.notificationRepo.create({
      user: { id: input.userId },
      task: input.taskId ? { id: input.taskId } : undefined,
      title: input.title,
      message: input.message,
      sent_at: new Date(),
      is_read: false,
    });

    await this.notificationRepo.save(notification);

    if (input.fcmToken) {
      await this.sendPushNotification(input.fcmToken, input.title, input.message, {
        notificationId: notification.id,
        taskId: input.taskId,
      });
    }
  }

  async getUserNotifications(userId: string, pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const [notifications, total] = await this.notificationRepo.findAndCount({
      where: { user: { id: userId } },
      relations: ['task'],
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    return {
      notifications: notifications.map(notification => new NotificationDto(notification)),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    const notification = await this.notificationRepo.findOne({
      where: { id: notificationId },
      relations: ['user'],
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.user.id !== userId) {
      throw new ForbiddenException('You do not have permission to read this notification');
    }

    if (notification.is_read) {
      return true;
    }

    const result = await this.notificationRepo.update(
      { id: notificationId },
      { is_read: true },
    );

    return (result.affected ?? 0) > 0;
  }
}

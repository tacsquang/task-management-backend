import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { admin } from '@modules/firebase/firebase-admin';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Task } from '../tasks/entities/task.entity';
import { Notification } from './entities/notification.entity';
import { NotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  async sendPushNotification(token: string, title: string, body: string, data?: any) {
    const message = {
      notification: {
        title,
        body,
      },
      token,
      data: data || {},
    };

    try {
      const response = await admin.messaging().send(message);
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
  }

  async getUserNotifications(userId: string): Promise<NotificationDto[]> {
    const notifications = await this.notificationRepo.find({
      where: { user: { id: userId } },
      order: { sent_at: 'DESC' },
      relations: ['task'],
    });

    return notifications.map(n => new NotificationDto(n));
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

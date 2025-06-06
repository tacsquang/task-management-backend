import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TasksService } from '@modules/tasks/services/tasks.service'; 
import { NotificationService } from '@modules/notification/services/notification.service'; 

@Injectable()
export class NotificationCronService {
  private readonly logger = new Logger(NotificationCronService.name);

  constructor(
    private readonly taskService: TasksService,
    private readonly notificationService: NotificationService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleTaskNotifications() {
    const now = new Date();

    const tasks = await this.taskService.getTasksToNotify();
    console.log(tasks);

    for (const task of tasks) {
        const token = await this.taskService.getUserDeviceToken(task.created_by);

        // Convert to Vietnam timezone (UTC+7)
        const dueAtTime = new Date(task.due_at).toLocaleTimeString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });

        const title = '[NOTIFICATION] Nhắc việc sắp đến hạn';
        const message = `Task "${task.title}" sắp tới hạn lúc ${dueAtTime}`;

        // Lưu vào DB
        await this.notificationService.createNotification({
            userId: task.created_by,
            taskId: task.id,
            title,
            message,
        });

        if (token) {
            await this.notificationService.sendPushNotification(
                token,
                title,
                message,
                { taskId: task.id.toString() },
            );
        }
    }

    this.logger.log(`Checked and sent ${tasks.length} notifications`);
  }
}

import { Notification } from '../entities/notification.entity';
import { TaskDto } from '@modules/tasks/dto/task.dto';

export class NotificationDto {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: Date;
  sent_at: Date;
  task_id?: String;

  constructor(entity: Notification) {
    this.id = entity.id;
    this.title = entity.title;
    this.message = entity.message;
    this.is_read = entity.is_read;
    this.created_at = entity.created_at;
    this.sent_at = entity.sent_at;
    this.task_id = entity.task?.id ?? "";
  }
}

import { Timestamp } from "rxjs";
import { Task } from "../entities/task.entity";

export class TaskDto {
  id: string;
  title: string;
  status: string;
  due_at: string | null;
  notify_enabled: boolean;
  notify_offset_minutes: number;
  created_by_id: string;
  created_by_name: string;
  created_at: string;
  updated_at: string;

  constructor(task: Task) {
    this.id = task.id;
    this.title = task.title;
    this.status = task.status;
    this.due_at = task.due_at
      ? (task.due_at instanceof Date ? task.due_at.toISOString() : String(task.due_at))
      : null;

    this.notify_enabled = task.notify_enabled;
    this.notify_offset_minutes = task.notify_offset_minutes;
  }
}

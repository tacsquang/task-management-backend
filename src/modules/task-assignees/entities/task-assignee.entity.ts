import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Timestamp,
} from 'typeorm';
import { Task } from '@modules/tasks/entities/task.entity';
import { User } from '@modules/users/entities/user.entity';

@Entity({ name: 'task_assignees' })
export class TaskAssignee {
  @PrimaryColumn({ type: 'int' })
  task_id: number;

  @PrimaryColumn({ type: 'uuid' })
  user_id: string;

  @CreateDateColumn({ name: 'assigned_at' })
  assigned_at: Timestamp;

  @ManyToOne(() => Task, task => task.assignees, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @ManyToOne(() => User, user => user.assignedTasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

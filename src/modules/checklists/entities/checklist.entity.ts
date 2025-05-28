import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Timestamp,
} from 'typeorm';
import { User } from '@modules/users/entities/user.entity';
import { Task } from '@modules/tasks/entities/task.entity';

@Entity({ name: 'checklists' })
export class Checklist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  title: string;

  @Column({ name: 'is_done', type: 'boolean', default: false })
  is_done: boolean;

  @ManyToOne(() => Task, task => task.checklists, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @ManyToOne(() => User, user => user.createdChecklists, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Timestamp;
}

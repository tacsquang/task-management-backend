import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Project } from '@modules/projects/entities/project.entity';
import { User } from '@modules/users/entities/user.entity';
import { Notification } from '@/modules/notification/entities/notification.entity';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Project, project => project.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ type: 'text' })
  title: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'todo',
  })
  status: 'todo' | 'in_progress' | 'done';

  @Column({ type: 'timestamp', nullable: true })
  due_at?: Date;

  @Column({ type: 'boolean', default: false, name: 'notify_enabled' })
  notify_enabled: boolean;

  @Column({ type: 'int', default: 10, name: 'notify_offset_minutes' }) // ví dụ: 10 phút trước
  notify_offset_minutes: number;

  @ManyToOne(() => User, user => user.createdTasks, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => Notification, notification => notification.task)
  notifications: Notification[];
}

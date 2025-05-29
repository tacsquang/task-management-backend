import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  Timestamp,
} from 'typeorm';
import { User } from '@modules/users/entities/user.entity';
import { Task } from '@modules/tasks/entities/task.entity';
import { ProjectMember } from '@/modules/project-members/entities/project-member.entity';

@Entity({ name: 'projects' })
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'timestamp', nullable: true })
    start_date: Timestamp;

    @Column({ type: 'timestamp', nullable: true })
    end_date: Timestamp;

    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'owner_by' })
    owner_by: User;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Timestamp;

    @OneToMany(() => Task, task => task.project)
    tasks: Task[];

    @OneToMany(() => ProjectMember, member => member.project)
    members: ProjectMember[];
}

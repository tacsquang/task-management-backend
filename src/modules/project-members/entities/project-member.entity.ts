import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Timestamp,
} from 'typeorm';
import { Project } from '@modules/projects/entities/project.entity';
import { User } from '@modules/users/entities/user.entity';

@Entity({ name: 'project_members' })
export class ProjectMember {
  @PrimaryColumn({ type: 'uuid' })
  project_id: string;

  @PrimaryColumn({ type: 'uuid' })
  user_id: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'member',
  })
  role: 'owner' | 'admin' | 'member' | 'viewer';

  @CreateDateColumn({ name: 'joined_at' })
  joined_at: Timestamp;

  @ManyToOne(() => Project, project => project.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => User, user => user.projectMemberships, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

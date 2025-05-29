import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    JoinColumn,
    Timestamp,
} from 'typeorm';
import { Project } from '@modules/projects/entities/project.entity';
import { User } from '@modules/users/entities/user.entity';
import { Checklist } from '@/modules/checklists/entities/checklist.entity';
import { TaskAssignee } from '@/modules/task-assignees/entities/task-assignee.entity';

@Entity({ name: 'tasks' })
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Project, project => project.tasks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @Column({ type: 'text' })
    title: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({
        type: 'varchar',
        length: 20,
        default: 'todo',
    })
    status: 'todo' | 'in_progress' | 'done';

    @Column({ type: 'timestamp', nullable: true })
    due_date?: string;

    @ManyToOne(() => User, user => user.createdTasks, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'created_by' })
    created_by: User;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Timestamp;

    @OneToMany(() => Checklist, checklist => checklist.task)
    checklists: Checklist[];

    @OneToMany(() => TaskAssignee, assignee => assignee.task)
    assignees: TaskAssignee[];

}

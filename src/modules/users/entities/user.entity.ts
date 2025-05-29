import { 
    Column, 
    Entity, 
    PrimaryGeneratedColumn,
    OneToMany,
 } from "typeorm";
import { Task } from '@modules/tasks/entities/task.entity'
import { Checklist } from "@/modules/checklists/entities/checklist.entity";
import { ProjectMember } from "@/modules/project-members/entities/project-member.entity";
import { TaskAssignee } from "@/modules/task-assignees/entities/task-assignee.entity";

@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'text',unique: true, nullable: false})
    email: string;

    @Column({type: 'text', nullable: false})
    password: string;

    @Column({type: 'text', nullable: false})
    name: string;

    @Column({
        type: 'varchar',
        length: 20,
        default: 'user',
        nullable: false
    })
    role: 'user' | 'admin';

    @Column({type: 'boolean', default: false, nullable: false})
    is_active: boolean; 

    @Column({type:'boolean', default: false, nullable: false})
    is_ban: boolean;

    @Column({ type: 'varchar', length: 20, default: 'local' })
    provider: 'local' | 'google';

    @OneToMany(() => Task, task => task.created_by)
    createdTasks: Task[];

    @OneToMany(() => Checklist, checklist => checklist.created_by)
    createdChecklists: Checklist[];

    @OneToMany(() => ProjectMember, member => member.user)
    projectMemberships: ProjectMember[];

    @OneToMany(() => TaskAssignee, assignee => assignee.user)
    assignedTasks: TaskAssignee[];
}

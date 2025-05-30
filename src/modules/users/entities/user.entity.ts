import { 
    Column, 
    Entity, 
    PrimaryGeneratedColumn,
    OneToMany,
 } from "typeorm";
import { Task } from '@modules/tasks/entities/task.entity'
import { Notification } from "@/modules/notification/entities/notification.entity";

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

    @Column({ type: 'text', nullable: true })
    device_fcm_token: string | null;

    @Column({ type: 'text', nullable: true })
    avatar: string | null;

    @Column({ type: 'varchar', length: 20, default: 'local' })
    provider: 'local' | 'google';

    @OneToMany(() => Task, task => task.created_by)
    createdTasks: Task[];

    @OneToMany(() => Notification, notification => notification.user)
    notifications: Notification[];
}

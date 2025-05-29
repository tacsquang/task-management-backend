import { Module } from '@nestjs/common';
import { TaskAssigneesService } from './task-assignees.service';
import { TaskAssigneesController } from './task-assignees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskAssignee } from './entities/task-assignee.entity';
import { Task } from '../tasks/entities/task.entity';
import { ProjectMember } from '../project-members/entities/project-member.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskAssignee, Task, ProjectMember])],
  controllers: [TaskAssigneesController],
  providers: [TaskAssigneesService],
})
export class TaskAssigneesModule {}

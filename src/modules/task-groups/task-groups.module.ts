import { Module } from '@nestjs/common';
import { TaskGroupsService } from './task-groups.service';
import { TaskGroupsController } from './task-groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskGroup } from './entities/task-group.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskGroup, User])],
  controllers: [TaskGroupsController],
  providers: [TaskGroupsService],
})
export class TaskGroupsModule {}

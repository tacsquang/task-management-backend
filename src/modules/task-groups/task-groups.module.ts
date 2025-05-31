import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskGroupsService } from './services/task-groups.service';
import { TaskGroupsController } from './controllers/task-groups.controller';
import { TaskGroup } from './entities/task-group.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskGroup, User])],
  controllers: [TaskGroupsController],
  providers: [TaskGroupsService],
})
export class TaskGroupsModule {}

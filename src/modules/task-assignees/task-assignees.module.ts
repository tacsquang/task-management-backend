import { Module } from '@nestjs/common';
import { TaskAssigneesService } from './task-assignees.service';
import { TaskAssigneesController } from './task-assignees.controller';

@Module({
  controllers: [TaskAssigneesController],
  providers: [TaskAssigneesService],
})
export class TaskAssigneesModule {}

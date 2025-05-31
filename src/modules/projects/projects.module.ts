import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './services/projects.service';
import { ProjectsController } from './controllers/projects.controller';
import { Project } from '@modules/projects/entities/project.entity';
import { TaskGroup } from '../task-groups/entities/task-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, TaskGroup])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}

import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '@modules/projects/entities/project.entity';
import { TaskGroup } from '../task-groups/entities/task-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, TaskGroup])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}

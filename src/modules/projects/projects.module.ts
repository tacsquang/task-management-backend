import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '@modules/projects/entities/project.entity';
import { ProjectMember } from '@modules/project-members/entities/project-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectMember])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}

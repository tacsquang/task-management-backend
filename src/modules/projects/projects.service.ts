import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { User } from '@modules/users/entities/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { NotFoundException } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { ProjectMember } from '../project-members/entities/project-member.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,

    @InjectRepository(ProjectMember)
    private pjMemberRepo: Repository<ProjectMember>,
  ) {}

  async create(createProjectDto: CreateProjectDto, user: User) {
    const project = this.projectRepo.create({
      ...createProjectDto,
      owner_by: user,
    });

    const savedProject = await this.projectRepo.save(project);

    const member = this.pjMemberRepo.create({
      project_id: savedProject.id,
      user_id: user.id,
      role: 'owner',
    });
    await this.pjMemberRepo.save(member);

    return savedProject;
  }

  async update(id: string, dto: UpdateProjectDto, user: User) {
    const project = await this.projectRepo.findOne({ where: { id }, relations: ['owner_by']});

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.owner_by.id !== user.id) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa project này');
    }

    Object.assign(project, dto);
    //console.log("dto", dto);

    return this.projectRepo.save(project);
  }

  async delete(id: string, user: User) {
    const project = await this.projectRepo.findOne({where: {id}, relations: ['owner_by']});
    
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    else if (project.owner_by.id !== user.id) {
      throw new ForbiddenException('Bạn không có quyền xoa project này');
    }

    await this.projectRepo.delete(id);

    return { message: 'Project deleted successfully' };
  }

  // tim tat ca project cua 1 user

  // tim 1 project 
}

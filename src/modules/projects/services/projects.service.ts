import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '@modules/projects/entities/project.entity';
import { CreateProjectDto } from '@modules/projects/dto/create-project.dto';
import { UpdateProjectDto } from '@modules/projects/dto/update-project.dto';
import { NotFoundException } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { TaskGroup } from '@modules/task-groups/entities/task-group.entity';
import { ProjectDto } from '@modules/projects/dto/projects.dto';
import { PaginationDto } from '@shared/dto/pagination.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,

    @InjectRepository(TaskGroup)
    private taskGroupRepo: Repository<TaskGroup>,
  ) {}

  async createProject(dto: CreateProjectDto, userId: string) {
    let taskGroup: TaskGroup | undefined;

    if (dto.task_group_id) {
      const found = await this.taskGroupRepo.findOne({
        where: { id: dto.task_group_id },
        relations: ['createdBy'], 
      });

      if (!found) {
        throw new NotFoundException('Task group not found');
      }

      if (found.createdBy.id !== userId) {
        throw new ForbiddenException('You do not have permission to create project in this task group');
      }

      taskGroup = found;
    }

    if ((dto.start_date && !dto.end_date) || (!dto.start_date && dto.end_date)) {
      throw new BadRequestException('start_date and end_date must be provided together or not at all');
    }

    const newProject = this.projectRepo.create({
      ...dto,
      start_date: dto.start_date ? new Date(dto.start_date) : undefined,
      end_date: dto.end_date ? new Date(dto.end_date) : undefined,
      created_by: { id: userId },
      ...(taskGroup && { task_group: taskGroup }), // chỉ gán nếu có
    });

    return new ProjectDto( await this.projectRepo.save(newProject) );
  }

  async updateProject(id: string, dto: UpdateProjectDto, userId: string) {
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: ['created_by'],
    });
    if (!project) throw new NotFoundException('Project not found');

    if (project.created_by.id !== userId) {
      throw new ForbiddenException('You do not have permission to edit this project');
    }

    if (dto.task_group_id) {
      const taskGroup = await this.taskGroupRepo.findOneBy({ id: dto.task_group_id });
      if (!taskGroup) throw new NotFoundException('Task group not found');
      project.task_group = taskGroup;
    }

    Object.assign(project, {
      ...dto,
      start_date: dto.start_date ? new Date(dto.start_date) : project.start_date,
      end_date: dto.end_date ? new Date(dto.end_date) : project.end_date,
    });

    return new ProjectDto( await this.projectRepo.save(project) );
  }

  async deleteProject(id: string, userId: string) {
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: ['created_by'],
    });

    if (!project) throw new NotFoundException('Project not found');

    if (project.created_by.id !== userId) {
      throw new ForbiddenException('You do not have permission to delete this project');
    }

    await this.projectRepo.remove(project);
    return { message: 'Deleted successfully' };
  }

  async getProjectsByTaskGroup(taskGroupId: string, userId: string, pagination: PaginationDto) {
    const taskGroup = await this.taskGroupRepo.findOne({
      where: { id: taskGroupId },
      relations: ['createdBy'],
    });

    if (!taskGroup) {
      throw new NotFoundException('Task group not found');
    }

    if (taskGroup.createdBy.id !== userId) {
      throw new ForbiddenException('You do not have permission to view projects in this task group');
    }

    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const [projects, total] = await this.projectRepo.findAndCount({
      where: { task_group: { id: taskGroupId } },
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    return {
      projects: projects.map(project => new ProjectDto(project)),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

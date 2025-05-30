import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { NotFoundException } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { TaskGroup } from '../task-groups/entities/task-group.entity';
import { ProjectDto } from './dto/projects.dto';

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
        throw new ForbiddenException('Bạn không có quyền tạo project trong task group này');
      }

      taskGroup = found;
    }

    if ((dto.start_date && !dto.end_date) || (!dto.start_date && dto.end_date)) {
      throw new BadRequestException('start_date và end_date phải cùng có hoặc cùng không');
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
      throw new ForbiddenException('Không có quyền sửa project này');
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
      throw new ForbiddenException('Không có quyền xoá project này');
    }

    await this.projectRepo.remove(project);
    return { message: 'Deleted successfully' };
  }

  async getProjectsByTaskGroup(taskGroupId: string): Promise<{ projects: ProjectDto[] }> {
    const taskGroup = await this.taskGroupRepo.findOneBy({ id: taskGroupId });
    if (!taskGroup) throw new NotFoundException('Task group not found');

    const projects = await this.projectRepo.find({
      where: { task_group: { id: taskGroupId } },
      relations: ['created_by', 'task_group'],
    });

    return {
      projects: projects.map(p => new ProjectDto(p)),
    };
  }
}

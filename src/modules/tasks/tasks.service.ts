import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { Project } from '@modules/projects/entities/project.entity';
import { User } from '@modules/users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { ProjectMember } from '../project-members/entities/project-member.entity';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class TasksService {
  constructor(
      @InjectRepository(Task)
      private taskRepo: Repository<Task>,

      @InjectRepository(Project)
      private projectRepo: Repository<Project>,

      @InjectRepository(User)
      private userRepo: Repository<User>,

      @InjectRepository(ProjectMember)
      private memberRepo: Repository<ProjectMember>,
  ) {}

  async create(createTaskDto: CreateTaskDto, creatorId: string): Promise<Task> {
    const project = await this.projectRepo.findOne({ where: { id: createTaskDto.projectId } });
    if (!project) throw new NotFoundException('Project not found');

    const current = await this.memberRepo.findOneBy({
      project_id: createTaskDto.projectId,
      user_id: creatorId,
    });

    if (!current) {
      throw new ForbiddenException('You are not a member of this project.');
    }
    else if (!['admin', 'owner'].includes(current.role)) {
      throw new ForbiddenException('Only admin or owner can create task');
    }

    const creator = await this.userRepo.findOne({ where: { id: creatorId } });
    if (!creator) throw new NotFoundException('Creator user not found');

    const task = this.taskRepo.create({
        ...createTaskDto,
        project,
        created_by: creator,
    });

    return this.taskRepo.save(task);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['project'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const current = await this.memberRepo.findOneBy({
      project_id: task.project.id,
      user_id: userId,
    });

    if (!current) {
      throw new ForbiddenException('You are not a member of this project.');
    }
    else if (!['admin', 'owner'].includes(current.role)) {
      throw new ForbiddenException('Only admin or owner can update task');
    }

    Object.assign(task, updateTaskDto);

    return await this.taskRepo.save(task);
  }

  async remove(id: number, userId: string): Promise<void> {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['project', 'created_by'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const current = await this.memberRepo.findOneBy({
      project_id: task.project.id,
      user_id: userId,
    });

    if (!current) {
      throw new ForbiddenException('You are not a member of this project.');
    }
    else if (!['admin', 'owner'].includes(current.role)) {
      throw new ForbiddenException('Only admin or owner can delete task');
    }

    await this.taskRepo.remove(task);
  }

}

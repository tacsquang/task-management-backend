import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateTaskAssigneeDto } from './dto/update-task-assignee.dto';
import { TaskAssignee } from './entities/task-assignee.entity';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { ProjectMember } from '../project-members/entities/project-member.entity';

@Injectable()
export class TaskAssigneesService {
  constructor(
    @InjectRepository(TaskAssignee)
    private assigneeRepo: Repository<TaskAssignee>,

    @InjectRepository(Task)
    private taskRepo: Repository<Task>,

    @InjectRepository(ProjectMember)
    private memberRepo: Repository<ProjectMember>,
  ) {}


  async assignUserToTask(taskId: number, userId: string, assignedById: string): Promise<TaskAssignee> {
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
      relations: ['project'],
    });
    if (!task) throw new NotFoundException('Task not found');

    const current = await this.memberRepo.findOneBy({
      project_id: task.project.id,
      user_id: assignedById,
    });

    if (!current) {
      throw new ForbiddenException('You are not a member of this project.');
    }
    if (!['admin', 'owner'].includes(current.role)) {
      throw new ForbiddenException('Only admin or owner can assign tasks');
    }

    const isMember = await this.memberRepo.findOneBy({
      project_id: task.project.id,
      user_id: userId,
    });

    if (!isMember || isMember.role === 'viewer') {
      throw new ForbiddenException('User is not a valid project member');
    }

    const existing = await this.assigneeRepo.findOne({
      where: { task_id: taskId, user_id: userId },
    });
    if (existing) {
      throw new ConflictException('User already assigned to this task');
    }

    const newAssignee = this.assigneeRepo.create({
      task_id: taskId,
      user_id: userId,
    });

    return this.assigneeRepo.save(newAssignee);
  }

  async unassignUserFromTask(taskId: number, userId: string, requestedById: string): Promise<void> {
    const task = await this.taskRepo.findOne({ where: { id: taskId }, relations: ['project'] });
    if (!task) throw new NotFoundException('Task not found');

    const current = await this.memberRepo.findOneBy({
      project_id: task.project.id,
      user_id: requestedById,
    });

    if (!current) {
      throw new ForbiddenException('You are not a member of this project.');
    }
    if (!['admin', 'owner'].includes(current.role)) {
      throw new ForbiddenException('Only admin or owner can unassign users');
    }

    const assignee = await this.assigneeRepo.findOneBy({ task_id: taskId, user_id: userId });
    if (!assignee) {
      throw new NotFoundException('User is not assigned to this task');
    }

    await this.assigneeRepo.remove(assignee);
  }
}

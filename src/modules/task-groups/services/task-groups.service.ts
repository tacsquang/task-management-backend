import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskGroup } from '@modules/task-groups/entities/task-group.entity';
import { CreateTaskGroupDto } from '@modules/task-groups/dto/create-task-group.dto';
import { UpdateTaskGroupDto } from '@modules/task-groups/dto/update-task-group.dto';
import { NotFoundException } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { PaginationDto } from '@shared/dto/pagination.dto';

@Injectable()
export class TaskGroupsService {
  constructor(
    @InjectRepository(TaskGroup)
    private taskGroupRepo: Repository<TaskGroup>,
  ) {}

  async create(dto: CreateTaskGroupDto, userId: string) {
    const taskGroup = this.taskGroupRepo.create({
      ...dto,
      createdBy: { id: userId },
    });

    return await this.taskGroupRepo.save(taskGroup);
  }

  async update(id: string, dto: UpdateTaskGroupDto, userId: string) {
    const taskGroup = await this.taskGroupRepo.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!taskGroup) {
      throw new NotFoundException('Task group not found');
    }

    if (taskGroup.createdBy.id !== userId) {
      throw new ForbiddenException('You do not have permission to update this task group');
    }

    Object.assign(taskGroup, dto);
    return await this.taskGroupRepo.save(taskGroup);
  }

  async delete(id: string, userId: string) {
    const taskGroup = await this.taskGroupRepo.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!taskGroup) {
      throw new NotFoundException('Task group not found');
    }

    if (taskGroup.createdBy.id !== userId) {
      throw new ForbiddenException('You do not have permission to delete this task group');
    }

    await this.taskGroupRepo.remove(taskGroup);
    return { message: 'Deleted successfully' };
  }

  async getTaskGroupsByUser(userId: string, pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const [taskGroups, total] = await this.taskGroupRepo.findAndCount({
      where: { createdBy: { id: userId } },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      taskGroups: taskGroups.map(taskGroup => ({
        id: taskGroup.id,
        name: taskGroup.name,
        description: taskGroup.description ?? "",
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
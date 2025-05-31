import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateTaskGroupDto } from '@modules/task-groups/dto/create-task-group.dto';
import { UpdateTaskGroupDto } from '@modules/task-groups/dto/update-task-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { TaskGroup } from '@modules/task-groups/entities/task-group.entity';
import { User } from '@modules/users/entities/user.entity';

@Injectable()
export class TaskGroupsService {
  constructor(
    @InjectRepository(TaskGroup)
    private taskGroupRepo: Repository<TaskGroup>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createTaskGroup(dto: CreateTaskGroupDto, userId: string) {
    const newGroup = this.taskGroupRepo.create({
      ...dto,
      createdBy: { id: userId },
    });
    return this.taskGroupRepo.save(newGroup);
  }

  async getTaskGroupsByUser(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const data = await this.taskGroupRepo.find({
      where: {
        createdBy: user,
      },
      order: {
        createdAt: 'DESC',
      },
    });
    if (!data) {
      return { "taskGroups": [] };
    }
    return {
      taskGroups: (await data).map(group => ({
        id: group.id,
        name: group.name,
        description: group.description ?? ""
      })),
    };
  }

  async updateTaskGroup(id: string, dto: UpdateTaskGroupDto, userId: string) {
    const group = await this.taskGroupRepo.findOne({
      where: {
        id,
        createdBy: { id: userId },
      },
    });

    if (!group) {
      throw new NotFoundException('Task group not found or not authorized');
    }

    Object.assign(group, dto);
    return this.taskGroupRepo.save(group);
  }

  async removeTaskGroup(id: string, userId: string) {
    const group = await this.taskGroupRepo.findOne({
      where: {
        id,
        createdBy: { id: userId },
      },
    });

    if (!group) {
      throw new NotFoundException('Task group not found or not authorized');
    }

    await this.taskGroupRepo.remove(group);
    return { message: 'Task group deleted successfully' };
  }
}
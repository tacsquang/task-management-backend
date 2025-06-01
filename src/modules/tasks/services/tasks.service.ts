import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CreateTaskDto } from '@modules/tasks/dto/create-task.dto';
import { UpdateTaskDto } from '@modules/tasks/dto/update-task.dto';
import { Task } from '@modules/tasks/entities/task.entity';
import { Project } from '@modules/projects/entities/project.entity';
import { User } from '@modules/users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { TaskDto } from '@modules/tasks/dto/task.dto';
import { PaginationDto } from '@shared/dto/pagination.dto';

@Injectable()
export class TasksService {
  prisma: any;
  constructor(
      @InjectRepository(Task)
      private taskRepo: Repository<Task>,

      @InjectRepository(Project)
      private projectRepo: Repository<Project>,

      @InjectRepository(User)
      private userRepo: Repository<User>,

  ) {}


  async create(dto: CreateTaskDto, userId: string) {
    const project = await this.projectRepo.findOne({
      where: { id: dto.project_id },
      relations: ['created_by'],
    });

    if (!project) throw new NotFoundException('Project not found');

    if (project.created_by.id !== userId) {
      throw new ForbiddenException('You do not have permission to create task in this project');
    }

    const task = this.taskRepo.create({
      title: dto.title,
      status: dto.status ?? 'todo',
      due_at: dto.due_at ? new Date(dto.due_at) : undefined,
      notify_enabled: dto.notify_enabled ?? false,
      notify_offset_minutes: dto.notify_offset_minutes ?? 10,
      project: { id: dto.project_id },
      created_by: { id: userId },
    });

    return new TaskDto(await this.taskRepo.save(task));
  }

  async update(id: string, dto: UpdateTaskDto, userId: string) {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['created_by'],
    });
    if (!task) throw new NotFoundException('Task not found');
    if (task.created_by?.id !== userId) {
      throw new ForbiddenException('You do not have permission to update this task');
    }

    if (dto.due_at) dto.due_at = new Date(dto.due_at).toISOString();
    this.taskRepo.merge(task, dto);
    return new TaskDto (await this.taskRepo.save(task) );
  }

  async delete(id: string, userId: string) {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['created_by'],
    });
    if (!task) throw new NotFoundException('Task not found');
    if (task.created_by?.id !== userId) {
      throw new ForbiddenException('You do not have permission to delete this task');
    }

    return new TaskDto (await this.taskRepo.remove(task));
  }

  async getTasksByProject(projectId: string, pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const [tasks, total] = await this.taskRepo.findAndCount({
      where: { project: { id: projectId } },
      order: { created_at: 'DESC' },
      relations: ['created_by'],
      skip,
      take: limit,
    });

    return {
      tasks: tasks.map(task => new TaskDto(task)),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTasksByDateAndStatus(userId: string, date: string, status: string): Promise<{ tasks: TaskDto[] }> {
    const query = this.taskRepo
      .createQueryBuilder('task')
      .leftJoin('task.created_by', 'user')
      .leftJoinAndSelect('task.project', 'project')
      .where('user.id = :userId', { userId })
      .andWhere('CAST(task.due_at AS DATE) = :date', { date });

    if (status && status !== 'all') {
      query.andWhere('task.status = :status', { status });
    }

    const tasks = await query.orderBy('task.due_at', 'ASC').getMany();

    return {
      tasks: tasks.map(task => new TaskDto(task)),
    };
  }



  
  async getTasksToNotify(): Promise<any[]> {
    const now = new Date();
    const fewMinutesLater = new Date(now.getTime() + 60 * 1000);

    const tasks = await this.taskRepo
      .createQueryBuilder('task')
      .addSelect(`task.due_at - INTERVAL '1 minute' * task.notify_offset_minutes`, 'remind_at')
      .where('task.notify_enabled = :enabled', { enabled: true })
      .andWhere('task.due_at IS NOT NULL')
      .andWhere('task.status != :done', { done: 'done' })
      .andWhere(
        `task.due_at - INTERVAL '1 minute' * task.notify_offset_minutes BETWEEN :now AND :soon`,
        { now, soon: fewMinutesLater },
      )
      .getRawMany();

    return tasks.map(task => ({
      id: task.task_id,
      title: task.task_title,
      due_at: task.task_due_at,
      remind_at: task.remind_at,
      created_by: task.task_created_by,
    }));
  }

  async getUserDeviceToken(userId: string) {
  
    const user = await this.userRepo.findOne({
      where: {
        id: userId
      },
    });

    return user?.device_fcm_token;
  }

}

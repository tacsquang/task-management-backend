import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException, Req } from '@nestjs/common';
import { TasksService } from '@modules/tasks/services/tasks.service';
import { CreateTaskDto } from '@modules/tasks/dto/create-task.dto';
import { UpdateTaskDto } from '@modules/tasks/dto/update-task.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { successResponse } from '@shared/utlis/response.utlis';
import * as dayjs from 'dayjs';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { BadRequestResponse, ForbiddenResponse, NotFoundResponse } from '@shared/swagger/responses.swagger';
import { PaginationDto } from '@shared/dto/pagination.dto';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get tasks by project' })
  @ApiParam({
    name: 'projectId',
    type: 'string',
    description: 'Project ID',
    example: '92abfa8e-b0ec-4976-ae09-30c1cbee3252',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved tasks',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Successfully retrieved tasks' },
        data: {
          type: 'object',
          properties: {
            tasks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: 'task-id-1' },
                  title: { type: 'string', example: 'Task 1' },
                  status: { type: 'string', example: 'todo' },
                  due_at: { type: 'string', example: '2025-05-31T07:52:00+07:00' },
                  project_id: { type: 'string', example: '92abfa8e-b0ec-4976-ae09-30c1cbee3252' },
                },
              },
            },
            pagination: {
              type: 'object',
              properties: {
                total: { type: 'number', example: 100 },
                page: { type: 'number', example: 1 },
                limit: { type: 'number', example: 10 },
                totalPages: { type: 'number', example: 10 },
              },
            },
          },
        },
      },
    },
  })
  @NotFoundResponse()
  @ForbiddenResponse()
  async getByProject(
    @Param('projectId') projectId: string,
    @Query() pagination: PaginationDto,
  ) {
    const result = await this.tasksService.getTasksByProject(projectId, pagination);
    return successResponse(result, 'Successfully retrieved tasks');
  }

  @Post()
  @ApiOperation({ summary: 'Create new task' })
  @ApiBody({ type: CreateTaskDto })
  @ApiCreatedResponse({
    description: 'Task created successfully',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 201 },
        message: { type: 'string', example: 'Task created successfully' },
        data: {
          type: 'object',
          example: {
            id: 'task_123',
            title: 'Write technical documentation',
            status: 'todo',
            due_at: '2025-05-31T07:52:00+07:00',
            notify_enabled: true,
            notify_offset_minutes: 10,
          },
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ForbiddenResponse()
  async create(@Body() dto: CreateTaskDto, @Req() req) {
    const task = await this.tasksService.create(dto, req.user.id);
    return successResponse(task, 'Task created successfully', 201);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiOkResponse({
    description: 'Task updated successfully',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Task updated successfully' },
        data: {
          type: 'object',
          example: {
            id: 'task_123',
            title: 'Update technical documentation',
            status: 'in_progress',
            due_at: '2025-06-20T23:59:59.000Z',
            notify_enabled: true,
            notify_offset_minutes: 10,
          },
        },
      },
    },
  })
  @NotFoundResponse()
  @ForbiddenResponse()
  async update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @Req() req) {
    const task = await this.tasksService.update(id, dto, req.user.id);
    return successResponse(task, 'Task updated successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task by ID' })
  @ApiOkResponse({
    description: 'Task deleted successfully',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Task deleted successfully' },
        data: {
          type: 'array',
          example: [],
        },
      },
    },
  })
  @NotFoundResponse()
  @ForbiddenResponse()
  async delete(@Param('id') id: string, @Req() req) {
    await this.tasksService.delete(id, req.user.id);
    return successResponse([], 'Task deleted successfully');
  }

  @Get('today')
  @ApiOperation({ summary: 'Filter tasks by date and status' })
  @ApiQuery({ name: 'date', required: true, example: '2025-05-30', description: 'Date to filter (format: YYYY-MM-DD)' })
  @ApiQuery({
    name: 'status',
    required: false,
    example: 'todo',
    description: 'Task status (all | todo | in_progress | done)',
  })
  @ApiOkResponse({
    description: 'Successfully filtered tasks by date and status',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Successfully filtered tasks by date and status' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'task_id_123' },
              title: { type: 'string', example: 'Task A' },
              status: { type: 'string', example: 'todo' },
              due_at: { type: 'string', format: 'date-time', example: '2025-05-30T17:00:00.000Z' },
              project_id: { type: 'string', example: 'project_id_123' },
            },
          },
        },
      },
    },
  })
  async filterByDateAndStatus(@Req() req, @Query('date') date: string, @Query('status') status: string) {
    if (!date || !dayjs(date, 'YYYY-MM-DD', true).isValid()) {
      throw new BadRequestException('Invalid date parameter (format: YYYY-MM-DD)');
    }
    const validStatuses = ['all', 'todo', 'in_progress', 'done'];
    if (status && !validStatuses.includes(status)) {
      throw new BadRequestException('Invalid status');
    }
    const tasks = await this.tasksService.getTasksByDateAndStatus(req.user.id, date, status);
    return successResponse(tasks, 'Successfully filtered tasks by date and status');
  }

}

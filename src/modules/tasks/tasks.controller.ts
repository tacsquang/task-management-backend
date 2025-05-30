import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Req } from '@nestjs/common';
import { successResponse } from '../shared/utlis/response.utlis';
import * as dayjs from 'dayjs';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { BadRequestResponse, ForbiddenResponse, NotFoundResponse } from '../shared/swagger/responses.swagger';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Lấy danh sách task theo project' })
  @ApiParam({
    name: 'projectId',
    type: 'string',
    description: 'ID của project',
    example: '92abfa8e-b0ec-4976-ae09-30c1cbee3252',
  })
  @ApiOkResponse({
    description: 'Lấy danh sách task thành công',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Lấy danh sách task thành công' },
        data: {
          type: 'array',
          example: [
            {
              id: 'task-id-1',
              title: 'Task 1',
              status: 'todo',
              due_at: '2025-06-01T00:00:00.000Z',
              project_id: '92abfa8e-b0ec-4976-ae09-30c1cbee3252',
            },
          ],
        },
      },
    },
  })
  @NotFoundResponse()
  @ForbiddenResponse()
  async getByProject(@Param('projectId') projectId: string) {
    const tasks = await this.tasksService.getTasksByProject(projectId);
    return successResponse(tasks, 'Lấy danh sách task thành công');
  }

  @Post()
  @ApiOperation({ summary: 'Tạo task mới' })
  @ApiBody({ type: CreateTaskDto })
  @ApiCreatedResponse({
    description: 'Tạo task thành công',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 201 },
        message: { type: 'string', example: 'Tạo task thành công' },
        data: {
          type: 'object',
          example: {
            id: 'task_123',
            title: 'Viết tài liệu kỹ thuật',
            status: 'todo',
            due_at: '2025-06-15T18:00:00.000Z',
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
    return successResponse(task, 'Tạo task thành công', 201);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật task' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiOkResponse({
    description: 'Cập nhật task thành công',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Cập nhật task thành công' },
        data: {
          type: 'object',
          example: {
            id: 'task_123',
            title: 'Cập nhật tài liệu kỹ thuật',
            status: 'in_progress',
            due_at: '2025-06-20T23:59:59.000Z',
          },
        },
      },
    },
  })
  @NotFoundResponse()
  @ForbiddenResponse()
  async update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @Req() req) {
    const task = await this.tasksService.update(id, dto, req.user.id);
    return successResponse(task, 'Cập nhật task thành công');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá task theo ID' })
  @ApiOkResponse({
    description: 'Xoá task thành công',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Xoá task thành công' },
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
    return successResponse([],'Xoá task thành công');
  }

  @Get('today')
  @ApiOperation({ summary: 'Lọc task theo ngày và trạng thái' })
  @ApiQuery({ name: 'date', required: true, example: '2025-05-30', description: 'Ngày cần lọc (định dạng: YYYY-MM-DD)' })
  @ApiQuery({
    name: 'status',
    required: false,
    example: 'todo',
    description: 'Trạng thái của task (all | todo | inprogress | done)',
  })
  @ApiOkResponse({
    description: 'Lọc task theo ngày và trạng thái thành công',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Lọc task theo ngày và trạng thái thành công' },
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
      throw new BadRequestException('Tham số ngày không hợp lệ (định dạng: YYYY-MM-DD)');
    }
    const validStatuses = ['all', 'todo', 'inprogress', 'done'];
    if (status && !validStatuses.includes(status)) {
      throw new BadRequestException('Trạng thái không hợp lệ');
    }
    const tasks = await this.tasksService.getTasksByDateAndStatus(req.user.id, date, status);
    return successResponse(tasks, 'Lọc task theo ngày và trạng thái thành công');
  }

}

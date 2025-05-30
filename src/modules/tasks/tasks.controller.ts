import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Req } from '@nestjs/common';
import { successResponse } from '../shared/utlis/response.utlis';
import * as dayjs from 'dayjs';

@UseGuards(AuthGuard('jwt'))
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('project/:projectId')
  async getByProject(@Param('projectId') projectId: string) {
    const tasks = await this.tasksService.getTasksByProject(projectId);
    return successResponse(tasks, 'Lấy danh sách task thành công');
  }

  @Post()
  async create(@Body() dto: CreateTaskDto, @Req() req) {
    const task = await this.tasksService.create(dto, req.user.id);
    return successResponse(task, 'Tạo task thành công', 201);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @Req() req) {
    const task = await this.tasksService.update(id, dto, req.user.id);
    return successResponse(task, 'Cập nhật task thành công');
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req) {
    await this.tasksService.delete(id, req.user.id);
    return successResponse([],'Xoá task thành công');
  }

  @Get('today')
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

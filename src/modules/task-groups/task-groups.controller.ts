import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseInterceptors, UseGuards } from '@nestjs/common';
import { TaskGroupsService } from './task-groups.service';
import { CreateTaskGroupDto } from './dto/create-task-group.dto';
import { UpdateTaskGroupDto } from './dto/update-task-group.dto';
import { AuthGuard } from '@nestjs/passport';
import { successResponse } from '../shared/utlis/response.utlis';

@UseGuards(AuthGuard('jwt'))
@Controller('task-groups')
export class TaskGroupsController {
  constructor(private readonly taskGroupsService: TaskGroupsService) {}

  @Post()
  async create(
    @Body() dto: CreateTaskGroupDto,
    @Req() req,
  ) {
    const data = await this.taskGroupsService.createTaskGroup(dto, req.user.id);
    return successResponse(data, 'Tao thanh cong', 201)
  }

  @Get()
  async findAll(
    @Req() req
  ) {
    const data = await this.taskGroupsService.getTaskGroupsByUser(req.user.id);
    return successResponse(data, 'Success lay thanh cong cac task-group');
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskGroupDto,
    @Req() req,
  ) {
    const data = await this.taskGroupsService.updateTaskGroup(id, dto, req.user.id);
    return successResponse(data, 'Cap nhat thang cong');
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string, 
    @Req() req
  ) {
    await this.taskGroupsService.removeTaskGroup(id, req.user.id);
    return successResponse([], 'Xoa thanh cong');
  }
}

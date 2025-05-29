import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskAssigneesService } from './task-assignees.service';
import { CreateTaskAssigneeDto } from './dto/create-task-assignee.dto';
import { UpdateTaskAssigneeDto } from './dto/update-task-assignee.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Req } from '@nestjs/common';
import { AssigneeDto } from './dto/assigness.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('tasks/:taskId/assignees/:userId')
export class TaskAssigneesController {
  constructor(private readonly taskAssigneesService: TaskAssigneesService) {}

  @Post()
  async assign(
    @Param('taskId') task_id: string,
    @Param('userId') user_id: string,
    @Req() req,
  ) {
    const assignerId = req.user.id;
    const result = await this.taskAssigneesService.assignUserToTask(Number(task_id), user_id, assignerId);
    return { message: 'User assigned successfully', assignee: result };
  }

  @Delete()
  async unassign(
    @Param('taskId') taskId: string,
    @Param('userId') userId: string,
    @Req() req,
  ) {
    await this.taskAssigneesService.unassignUserFromTask(Number(taskId), userId, req.user.id);
    return { message: 'User unassigned successfully' };
  }

}

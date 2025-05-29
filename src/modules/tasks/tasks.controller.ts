import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Req } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // Them task 
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createTaskDto: CreateTaskDto, @Req() req) {
      const user = req.user; // hoặc truyền trực tiếp từ API test
      return this.tasksService.create(createTaskDto, user.id);
  }

  // Cap nhat task 
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req,
  ) {
    return this.tasksService.update(id, updateTaskDto, req.user.id);
  }

  // Xoa task
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: number, @Req() req) {
    await this.tasksService.remove(id, req.user.id);
    return { message: 'Task deleted successfully' };
  }

  // // Tim task ???
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
  //   return this.tasksService.update(+id, updateTaskDto);
  // }

  // // Xem tat ca task (phan trang)
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tasksService.remove(+id);
  // }

  // Loc task (todo , inprocess, done)
}

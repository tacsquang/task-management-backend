import { Controller, Get, Post, Body, Req, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateProjectDto } from './dto/update-project.dto';
import { successResponse } from '../shared/utlis/response.utlis';

@UseGuards(AuthGuard('jwt'))
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(@Body() dto: CreateProjectDto, @Req() req) {
    const data = await this.projectsService.createProject(dto, req.user.id);
    return successResponse(data, 'Tạo project thành công', 201);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProjectDto, @Req() req) {
    const data = await this.projectsService.updateProject(id, dto, req.user.id);
    return successResponse(data, 'Cập nhật project thành công');
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req) {
    const data = await this.projectsService.deleteProject(id, req.user.id);
    return successResponse(data, 'Xoá project thành công');
  }

  @Get('task-group/:taskGroupId')
  async getByTaskGroup(@Param('taskGroupId') taskGroupId: string) {
    const data = await this.projectsService.getProjectsByTaskGroup(taskGroupId);
    return successResponse(data, 'Lấy danh sách project theo task group thành công');
  }

}

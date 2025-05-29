import { Controller, Get, Post, Body, Req, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() dto: CreateProjectDto, @Req() req) {
    const user = req.user;
    return this.projectsService.create(dto, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @Req() req
  ) {
    const user = req.user;
    return this.projectsService.update(id, dto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(
    @Param('id') id: string,
    @Req() req,
  ) {
    const user = req.user;
    return this.projectsService.delete(id, user);
  }
}

import { Controller, Get, Post, Body, Req, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateProjectDto } from './dto/update-project.dto';
import { successResponse } from '../shared/utlis/response.utlis';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { BadRequestResponse, ForbiddenResponse, NotFoundResponse } from '../shared/swagger/responses.swagger';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiBody({ type: CreateProjectDto })
  @ApiCreatedResponse({
    description: 'Tạo project thành công',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 201 },
        message: { type: 'string', example: 'Tạo project thành công' },
        data: {
          type: 'object',
          example: {
            id: 'project_id_123',
            name: 'Project Alpha',
            description: 'This is a test project',
            start_date: '2024-01-01T00:00:00.000Z',
            end_date: '2024-12-31T23:59:59.000Z',
            logo_image: 'https://example.com/logo.png',
          },
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ForbiddenResponse()
  async create(@Body() dto: CreateProjectDto, @Req() req) {
    const data = await this.projectsService.createProject(dto, req.user.id);
    return successResponse(data, 'Tạo project thành công', 201);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiParam({ name: 'id', description: 'Project ID', example: 'project_id_123' })
  @ApiBody({ type: UpdateProjectDto })
  @ApiOkResponse({
    description: 'Cập nhật project thành công',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Cập nhật project thành công' },
        data: {
          type: 'object',
          example: {
            id: 'project_id_123',
            name: 'Updated Project Name',
            description: 'Updated project description',
            start_date: '2024-02-01',
            end_date: '2024-11-30',
            logo_image: 'https://example.com/updated-logo.png',
          },
        },
      },
    },
  })
  @NotFoundResponse()
  @BadRequestResponse()
  @ForbiddenResponse()
  async update(@Param('id') id: string, @Body() dto: UpdateProjectDto, @Req() req) {
    const data = await this.projectsService.updateProject(id, dto, req.user.id);
    return successResponse(data, 'Cập nhật project thành công');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The ID of the project to delete',
    example: 'b7e6712f-4e2d-4d1a-b123-f1c2e3c8e9ab',
  })
  @ApiOkResponse({
    description: 'Project deleted successfully',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Xoá project thành công' },
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
    const data = await this.projectsService.deleteProject(id, req.user.id);
    return successResponse(data, 'Xoá project thành công');
  }

  @Get('task-group/:taskGroupId')
  @ApiOperation({ summary: 'Get all projects by Task Group ID' })
  @ApiParam({
    name: 'taskGroupId',
    type: 'string',
    description: 'ID of the task group',
    example: '9e36a611-447b-4c97-9908-113e613cf2b3',
  })
  @ApiOkResponse({
    description: 'List of projects retrieved successfully',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Lấy danh sách project theo task group thành công' },
        data: {
          type: 'array',
          example: [
            {
              id: 'project-id-1',
              name: 'Project Alpha',
              description: 'Description of Project Alpha',
              start_date: '2024-12-01T00:00:00.000Z',
              end_date: '2025-01-01T00:00:00.000Z',
              logo_image: 'https://example.com/logo1.png',
              task_group_id: '9e36a611-447b-4c97-9908-113e613cf2b3',
            },
            {
              id: 'project-id-2',
              name: 'Project Beta',
              description: 'Description of Project Beta',
              start_date: "",
              end_date: "",
              logo_image: "",
              task_group_id: '9e36a611-447b-4c97-9908-113e613cf2b3',
            },
          ],
        },
      },
    },
  })
  @NotFoundResponse()
  @ForbiddenResponse()
  async getByTaskGroup(@Param('taskGroupId') taskGroupId: string) {
    const data = await this.projectsService.getProjectsByTaskGroup(taskGroupId);
    return successResponse(data, 'Lấy danh sách project theo task group thành công');
  }

}

import { Controller, Get, Post, Body, Req, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { successResponse } from '@shared/utlis/response.utlis';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { BadRequestResponse, ForbiddenResponse, NotFoundResponse } from '@shared/swagger/responses.swagger';
import { PaginationDto } from '@shared/dto/pagination.dto';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiBody({ type: CreateProjectDto })
  @ApiCreatedResponse({
    description: 'Project created successfully',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 201 },
        message: { type: 'string', example: 'Project created successfully' },
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
    return successResponse(data, 'Project created successfully', 201);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiParam({ name: 'id', description: 'Project ID', example: 'project_id_123' })
  @ApiBody({ type: UpdateProjectDto })
  @ApiOkResponse({
    description: 'Project updated successfully',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Project updated successfully' },
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
    return successResponse(data, 'Project updated successfully');
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
        message: { type: 'string', example: 'Project deleted successfully' },
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
    return successResponse([], 'Project deleted successfully');
  }

  @Get('task-group/:taskGroupId')
  @ApiOperation({ summary: 'Get all projects by Task Group ID' })
  @ApiParam({
    name: 'taskGroupId',
    type: 'string',
    description: 'ID of the task group',
    example: '9e36a611-447b-4c97-9908-113e613cf2b3',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (starts from 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
    example: 10,
  })
  @ApiOkResponse({
    description: 'Successfully retrieved projects by task group',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Successfully retrieved projects by task group' },
        data: {
          type: 'object',
          properties: {
            projects: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: 'project-id-1' },
                  name: { type: 'string', example: 'Project Alpha' },
                  description: { type: 'string', example: 'Description of Project Alpha' },
                  start_date: { type: 'string', format: 'date-time', example: '2024-12-01T00:00:00.000Z' },
                  end_date: { type: 'string', format: 'date-time', example: '2025-01-01T00:00:00.000Z' },
                  logo_image: { type: 'string', example: 'https://example.com/logo1.png' },
                  task_group_id: { type: 'string', example: '9e36a611-447b-4c97-9908-113e613cf2b3' },
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
  async getByTaskGroup(
    @Param('taskGroupId') taskGroupId: string,
    @Query() pagination: PaginationDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    const data = await this.projectsService.getProjectsByTaskGroup(taskGroupId, userId, pagination);
    return successResponse(data, 'Successfully retrieved projects by task group');
  }

}

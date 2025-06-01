import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseInterceptors, UseGuards, Query } from '@nestjs/common';
import { TaskGroupsService } from '@modules/task-groups/services/task-groups.service';
import { CreateTaskGroupDto } from '@modules/task-groups/dto/create-task-group.dto';
import { UpdateTaskGroupDto } from '@modules/task-groups/dto/update-task-group.dto';
import { AuthGuard } from '@nestjs/passport';
import { successResponse } from '@shared/utlis/response.utlis';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { BadRequestResponse, ForbiddenResponse, NotFoundResponse } from '@shared/swagger/responses.swagger';
import { PaginationDto } from '@shared/dto/pagination.dto';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('task-groups')
export class TaskGroupsController {
  constructor(private readonly taskGroupsService: TaskGroupsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all task groups of current user' })
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
    description: 'Successfully retrieved task groups',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Successfully retrieved task groups' },
        data: {
          type: 'object',
          properties: {
            taskGroups: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: '8a7187cc-a044-4659-8c0a-0f9a3eb9fcac' },
                  name: { type: 'string', example: 'work' },
                  description: { type: 'string', example: 'Tasks related to personal work' },
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
  async findAll(
    @Req() req,
    @Query() pagination: PaginationDto,
  ) {
    const data = await this.taskGroupsService.getTaskGroupsByUser(req.user.id, pagination);
    return successResponse(data, 'Successfully retrieved task groups');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task group' })
  @ApiBody({ type: CreateTaskGroupDto })
  @ApiCreatedResponse({
    description: 'Task group created successfully',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 201 },
        message: { type: 'string', example: 'Task group created successfully' },
        data: {
          type: 'object',
          example: {
            id: '8a7187cc-a044-4659-8c0a-0f9a3eb9fcac',
            name: 'work',
            description: 'Tasks related to personal work',
          },
        },
      },
    },
  })
  @BadRequestResponse()
  async create(@Body() dto: CreateTaskGroupDto, @Req() req) {
    const data = await this.taskGroupsService.create(dto, req.user.id);
    return successResponse(data, 'Task group created successfully', 201);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task group' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Task group ID',
    example: '8a7187cc-a044-4659-8c0a-0f9a3eb9fcac',
  })
  @ApiBody({ type: UpdateTaskGroupDto })
  @ApiOkResponse({
    description: 'Task group updated successfully',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Task group updated successfully' },
        data: {
          type: 'object',
          example: {
            id: '8a7187cc-a044-4659-8c0a-0f9a3eb9fcac',
            name: 'updated work',
            description: 'Updated tasks related to personal work',
          },
        },
      },
    },
  })
  @NotFoundResponse()
  @ForbiddenResponse()
  async update(@Param('id') id: string, @Body() dto: UpdateTaskGroupDto, @Req() req) {
    const data = await this.taskGroupsService.update(id, dto, req.user.id);
    return successResponse(data, 'Task group updated successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task group' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Task group ID',
    example: '8a7187cc-a044-4659-8c0a-0f9a3eb9fcac',
  })
  @ApiOkResponse({
    description: 'Task group deleted successfully',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Task group deleted successfully' },
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
    await this.taskGroupsService.delete(id, req.user.id);
    return successResponse([], 'Task group deleted successfully');
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseInterceptors, UseGuards } from '@nestjs/common';
import { TaskGroupsService } from './task-groups.service';
import { CreateTaskGroupDto } from './dto/create-task-group.dto';
import { UpdateTaskGroupDto } from './dto/update-task-group.dto';
import { AuthGuard } from '@nestjs/passport';
import { successResponse } from '../shared/utlis/response.utlis';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { BadRequestResponse, ForbiddenResponse, NotFoundResponse } from '../shared/swagger/responses.swagger';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('task-groups')
export class TaskGroupsController {
  constructor(private readonly taskGroupsService: TaskGroupsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task group' })
  @ApiBody({ type: CreateTaskGroupDto })
  @ApiCreatedResponse({
    description: 'Task group created successfully',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 201 },
        message: { type: 'string', example: 'Created successfully' },
        data: {
          type: 'object',
          example: {
            id: 'group_id_123',
          },
        },
      },
    },
  })
  @BadRequestResponse()
  async create(
    @Body() dto: CreateTaskGroupDto,
    @Req() req,
  ) {
    const data = await this.taskGroupsService.createTaskGroup(dto, req.user.id);
    return successResponse({id: data.id}, 'Created successfully', 201)
  }

  @Get()
  @ApiOperation({ summary: 'Get all task groups of current user' })
  @ApiOkResponse({
    description: 'Successfully retrieved task groups',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Successfully retrieved task groups' },
        data: {
          type: 'object',
          example: {
            taskGroups: [
              { id: "8a7187cc-a044-4659-8c0a-0f9a3eb9fcac", name: "work", description: "Tasks related to personal work"},
              { id: "9a7187cc-a044-4659-8c0a-0f9a3eb9fcac", name: "study", description: "Tasks related to personal study"},
            ],
          },
        },
      },
    },
  })
  async findAll(
    @Req() req
  ) {
    const data = await this.taskGroupsService.getTaskGroupsByUser(req.user.id);
    return successResponse(data, 'Successfully retrieved task groups');
  }


  @Patch(':id')
  @ApiOperation({ summary: 'Update task group by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Task group ID',
    example: 'group_id_123',
  })
  @ApiBody({ type: UpdateTaskGroupDto })
  @ApiOkResponse({
    description: 'Update successful',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Update successful' },
        data: {
          type: 'object',
          example: {
            id: "db32563e-0477-4fb7-8382-a22eec7265ed",
            name: "New group name",
            description: "Updated description for the task group",
            createdAt: "2025-05-29T21:06:15.049Z",
            updatedAt: "2025-05-30T17:18:16.412Z"
          },
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ForbiddenResponse()
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskGroupDto,
    @Req() req,
  ) {
    const data = await this.taskGroupsService.updateTaskGroup(id, dto, req.user.id);
    return successResponse(data, 'Update successful');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task group by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Task group ID to be deleted',
    example: 'group_id_123',
  })
  @ApiOkResponse({
    description: 'Delete successful',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Delete successful' },
        data: {
          type: 'array',
          example: [],
        },
      },
    },
  })
  @NotFoundResponse()
  async remove(
    @Param('id') id: string, 
    @Req() req
  ) {
    await this.taskGroupsService.removeTaskGroup(id, req.user.id);
    return successResponse([], 'Delete successful');
  }
}

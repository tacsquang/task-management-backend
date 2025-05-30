// src/modules/tasks/dto/create-task.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsDateString, IsUUID } from 'class-validator';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export class CreateTaskDto {
  @ApiProperty({
    description: 'The title of the task',
    example: 'Complete project documentation',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The status of the task',
    enum: TaskStatus,
    example: TaskStatus.TODO,
  })
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiProperty({
    description: 'The due date of the task',
    example: '2024-03-25T10:00:00Z',
  })
  @IsDateString()
  due_at: string;

  @ApiProperty({
    description: 'The ID of the project this task belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  project_id: string;
}

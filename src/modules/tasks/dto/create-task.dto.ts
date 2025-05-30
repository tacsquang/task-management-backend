// src/modules/tasks/dto/create-task.dto.ts
import { IsString, IsOptional, IsEnum, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Title of the task',
    example: 'Project planning',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Status of the task',
    enum: ['todo', 'in_progress', 'done'],
    example: 'todo',
  })
  @IsOptional()
  @IsEnum(['todo', 'in_progress', 'done'])
  status?: 'todo' | 'in_progress' | 'done';

  @ApiPropertyOptional({
    description: 'Due date of the task (ISO 8601)',
    example: '2025-06-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  due_at?: string;

  @ApiProperty({
    description: 'ID of the project containing the task',
    example: '92abfa8e-b0ec-4976-ae09-30c1cbee3252',
  })
  @IsUUID()
  @IsString()
  project_id: string;
}

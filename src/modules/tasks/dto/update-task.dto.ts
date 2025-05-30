// src/modules/tasks/dto/update-task.dto.ts
import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiPropertyOptional({
    description: 'New title of the task',
    example: 'Update project plan',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'New status of the task',
    enum: ['todo', 'in_progress', 'done'],
    example: 'in_progress',
  })
  @IsOptional()
  @IsEnum(['todo', 'in_progress', 'done'])
  status?: 'todo' | 'in_progress' | 'done';

  @ApiPropertyOptional({
    description: 'New due date of the task (ISO 8601)',
    example: '2025-06-15T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  due_at?: string;
}

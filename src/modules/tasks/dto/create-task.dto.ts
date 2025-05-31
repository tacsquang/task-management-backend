// src/modules/tasks/dto/create-task.dto.ts
import { IsString, IsOptional, IsEnum, IsDateString, IsUUID, IsBoolean, IsInt, Min, Max } from 'class-validator';
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
    example: '2025-05-31T07:56:00+07:00',
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

    @ApiPropertyOptional({
    description: 'Enable notification for this task',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  notify_enabled?: boolean;

  @ApiPropertyOptional({
    description: 'How many minutes before due_at to notify',
    example: 10,
    minimum: 1,
    maximum: 1440, // 24 tiếng
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1440)
  notify_offset_minutes?: number;
}

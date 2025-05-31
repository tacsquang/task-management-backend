import { IsString, IsOptional, IsEnum, IsDateString, IsBoolean, IsInt } from 'class-validator';
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
    example: '2025-05-31T07:56:00+07:00',
  })
  @IsOptional()
  @IsDateString()
  due_at?: string;

  @ApiPropertyOptional({
    description: 'Enable or disable task notification',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  notify_enabled?: boolean;

  @ApiPropertyOptional({
    description: 'Number of minutes before due_at to notify',
    example: 10,
  })
  @IsOptional()
  @IsInt()
  notify_offset_minutes?: number;
}

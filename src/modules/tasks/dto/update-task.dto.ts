// src/modules/tasks/dto/update-task.dto.ts
import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiPropertyOptional({
    description: 'Tiêu đề mới của task',
    example: 'Cập nhật kế hoạch dự án',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Trạng thái mới của task',
    enum: ['todo', 'in_progress', 'done'],
    example: 'in_progress',
  })
  @IsOptional()
  @IsEnum(['todo', 'in_progress', 'done'])
  status?: 'todo' | 'in_progress' | 'done';

  @ApiPropertyOptional({
    description: 'Thời hạn mới của task (ISO 8601)',
    example: '2025-06-15T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  due_at?: string;
}

// src/modules/tasks/dto/create-task.dto.ts
import { IsString, IsOptional, IsEnum, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Tiêu đề của task',
    example: 'Lập kế hoạch dự án',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Trạng thái của task',
    enum: ['todo', 'in_progress', 'done'],
    example: 'todo',
  })
  @IsOptional()
  @IsEnum(['todo', 'in_progress', 'done'])
  status?: 'todo' | 'in_progress' | 'done';

  @ApiPropertyOptional({
    description: 'Hạn chót thực hiện task (ISO 8601)',
    example: '2025-06-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  due_at?: string;

  @ApiProperty({
    description: 'ID của project chứa task',
    example: '92abfa8e-b0ec-4976-ae09-30c1cbee3252',
  })
  @IsUUID()
  @IsString()
  project_id: string;
}

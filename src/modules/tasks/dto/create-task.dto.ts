// src/modules/tasks/dto/create-task.dto.ts
import { IsString, IsOptional, IsEnum, IsDateString, IsUUID } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsEnum(['todo', 'in_progress', 'done'])
  status?: 'todo' | 'in_progress' | 'done';

  @IsOptional()
  @IsDateString()
  due_at?: string;

  @IsUUID()
  @IsString()
  project_id: string;
}

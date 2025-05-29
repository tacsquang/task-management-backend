import { IsNotEmpty, IsOptional, IsString, IsEnum, IsDateString, IsInt, IsUUID } from 'class-validator';

export class CreateTaskDto {
    @IsUUID()
    projectId: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(['todo', 'in_progress', 'done'])
    status?: 'todo' | 'in_progress' | 'done';

    @IsOptional()
    @IsDateString()
    due_date?: string;
}

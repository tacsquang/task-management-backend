import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskGroupDto {
  @ApiProperty({ example: 'Personal', description: 'Name of the task group' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Tasks related to personal life', description: 'Optional description of the group' })
  @IsOptional()
  @IsString()
  description?: string;
}

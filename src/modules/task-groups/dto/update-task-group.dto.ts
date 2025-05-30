import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskGroupDto {
  @ApiPropertyOptional({ example: 'New group name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Updated description for the task group' })
  @IsOptional()
  @IsString()
  description?: string;
}
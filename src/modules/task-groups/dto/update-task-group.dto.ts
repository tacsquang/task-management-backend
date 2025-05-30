import { IsOptional, IsString } from 'class-validator';

export class UpdateTaskGroupDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

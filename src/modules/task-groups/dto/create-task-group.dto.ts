import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskGroupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

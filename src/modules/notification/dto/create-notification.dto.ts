import { IsUUID, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateNotificationDto {
  @IsUUID()
  user_id: string;

  @IsUUID()
  @IsOptional()
  task_id?: string;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsBoolean()
  @IsOptional()
  is_read?: boolean;
}

import { IsUUID, IsIn } from 'class-validator';

export class AssigneeDto {
  @IsUUID()
  user_id: string;
}
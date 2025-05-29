import { IsUUID, IsIn } from 'class-validator';

export class InvitationDto {
  @IsUUID()
  user_id: string;

  @IsIn(['owner', 'admin', 'member', 'viewer'])
  role: 'owner' | 'admin' | 'member' | 'viewer';
}

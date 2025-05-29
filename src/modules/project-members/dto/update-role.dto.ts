import { IsIn } from 'class-validator';

export class UpdateProjectMemberRoleDto {
  @IsIn(['owner','admin', 'member', 'viewer']) 
  role: 'owner'|'admin' | 'member' | 'viewer';
}

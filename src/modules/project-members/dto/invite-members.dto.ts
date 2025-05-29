import { Type } from 'class-transformer';
import { ValidateNested, IsArray } from 'class-validator';
import { InvitationDto } from './invitation.dto';

export class InviteMembersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvitationDto)
  invitations: InvitationDto[];
}

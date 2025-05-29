// src/modules/project-members/project-members.service.ts
import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectMember } from './entities/project-member.entity';
import { Repository } from 'typeorm';
import { UpdateProjectMemberRoleDto } from './dto/update-role.dto';
import { BadRequestException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';

type InviteResult = {
  user_id: string;
  status: 'invited' | 'already_member' | 'error';
  message?: string;
};

@Injectable()
export class ProjectMembersService {
  constructor(
    @InjectRepository(ProjectMember)
    private readonly memberRepo: Repository<ProjectMember>

  ) {}

  async inviteMembers(
    projectId: string,
    currentUserId: string,
    invitations: { user_id: string; role: string }[]
  ) {
    // 1. Check current user's role in the project
    const current = await this.memberRepo.findOneBy({
      project_id: projectId,
      user_id: currentUserId,
    });

    if (!current || !['admin', 'owner'].includes(current.role)) {
      throw new ForbiddenException('Only admin or owner can invite members');
    }

    const results: InviteResult[] = [];

    for (const invite of invitations) {
      const existing = await this.memberRepo.findOneBy({
        project_id: projectId,
        user_id: invite.user_id,
      });

      if (existing) {
        results.push({ user_id: invite.user_id, status: 'already_member' });
        continue;
      }

      try {
        await this.memberRepo.insert({
          project_id: projectId,
          user_id: invite.user_id,
          role: invite.role as any,
        });

        results.push({ user_id: invite.user_id, status: 'invited' });
      } catch (err) {
        results.push({ user_id: invite.user_id, status: 'error', message: err.message });
      }
    }

    return results;
  }

  async updateMemberRole(
    projectId: string,
    targetUserId: string,
    currentUserId: string,
    dto: UpdateProjectMemberRoleDto,
  ) {
    if (currentUserId === targetUserId) {
      throw new BadRequestException('You cannot change your own role.');
    }

    const caller = await this.memberRepo.findOneBy({
      project_id: projectId,
      user_id: currentUserId,
    });

    if (!caller) {
      throw new ForbiddenException('You are not a member of this project.');
    }
    else if (caller.role != 'owner') {
      throw new ForbiddenException('You do not have permission to update member roles.' );
    }

    const target = await this.memberRepo.findOneBy({
      project_id: projectId,
      user_id: targetUserId,
    });

    if (!target) {
      throw new NotFoundException('Target user is not a member of this project.');
    }

    // Chuyển quyền owner
    if (dto.role === 'owner') {
      target.role = 'owner';
      caller.role = 'admin'; 

      await this.memberRepo.save([target, caller]);

      return {
        message: 'Ownership transferred successfully.',
        new_owner_id: targetUserId,
      };
    }

    target.role = dto.role;
    await this.memberRepo.save(target);

    return {
      message: 'Role updated successfully.',
      user_id: targetUserId,
      new_role: dto.role,
    };
  }

  async leaveProject(projectId: string, userId: string) {
    const member = await this.memberRepo.findOneBy({ project_id: projectId, user_id: userId });
    if (!member) throw new NotFoundException('Bạn không phải là thành viên của dự án.');

    if (member.role === 'owner') {
      throw new BadRequestException('Owner không thể tự rời khỏi dự án. Vui lòng chuyển quyền trước.');
    }

    await this.memberRepo.delete({ project_id: projectId, user_id: userId });
    return { message: 'Đã rời khỏi dự án.' };
  }

  async removeMember(projectId: string, actorId: string, targetUserId: string) {
    if (actorId === targetUserId) {
      throw new BadRequestException('Không thể xóa chính mình bằng API này. Hãy dùng /leave.');
    }

    const actor = await this.memberRepo.findOneBy({ project_id: projectId, user_id: actorId });
    if (!actor) throw new ForbiddenException('Bạn không phải là thành viên của dự án.');

    const target = await this.memberRepo.findOneBy({ project_id: projectId, user_id: targetUserId });
    if (!target) throw new NotFoundException('Thành viên không tồn tại.');

    // Kiểm tra quyền
    if (actor.role !== 'owner') {
      throw new ForbiddenException('Bạn không có quyền xóa thành viên.');
    }

    await this.memberRepo.delete({ project_id: projectId, user_id: targetUserId });
    return { message: 'Đã xóa thành viên khỏi dự án.' };
  }
}

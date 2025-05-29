import { Controller, Get, Post, Body, Req, Patch, Param, Delete } from '@nestjs/common';
import { ProjectMembersService } from './project-members.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InviteMembersDto } from './dto/invite-members.dto';
import { UpdateProjectMemberRoleDto } from './dto/update-role.dto';

@Controller('projects/:projectId/members')
export class ProjectMembersController {
  constructor(private readonly pjMemService: ProjectMembersService) {}

  // Mời người dùng tham gia (truyền userId + role) (moi nhieu nguoi)
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async inviteMembers(
    @Param('projectId') projectId: string,
    @Body() dto: InviteMembersDto,
    @Req() req
  ) {
    const user = req.user;
    return this.pjMemService.inviteMembers(projectId, user.id, dto.invitations) 
  }

  // // Lấy danh sách thành viên của project 
  // @Get()
  // @UseGuards(AuthGuard('jwt'))
  // findAll() {
  //   return this.pjMemService.findAll();
  // }

  // Cập nhật vai trò
  @Patch('/:userId')
  @UseGuards(AuthGuard('jwt'))
  async updateRole(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
    @Body() dto: UpdateProjectMemberRoleDto,
    @Req() req
  ) {
    return this.pjMemService.updateMemberRole(
      projectId,
      userId,
      req.user.id,
      dto,
    );
  }

  // Tu roi khoi project (not owner)
  @Delete('/leave')
  @UseGuards(AuthGuard('jwt'))
  async leaveProject(
    @Param('projectId') projectId: string,
    @Req() req
  ) {
    const userId = req.user.id;
    return this.pjMemService.leaveProject(projectId, userId);
  }

  // Xoá thành viên khỏi project
  @Delete('/:userId')
  @UseGuards(AuthGuard('jwt'))
  async removeMember(
    @Param('projectId') projectId: string,
    @Param('userId') targetUserId: string,
    @Req() req
  ) {
    const actorId = req.user.id;
    return this.pjMemService.removeMember(projectId, actorId, targetUserId);
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity'
import { UserDto } from './dto/user-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async findById(id: string): Promise<UserDto> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    return new UserDto(user);
  }

  async updateProfile(id: string, dto: UpdateUserDto): Promise<UserDto> {
    if (!dto.name?.trim() && !dto.avatar?.trim()) {
      throw new BadRequestException('Phải cập nhật ít nhất một trường.');
    }

    const payload: Partial<UserDto> = {};
    if (dto.name?.trim()) payload.name = dto.name.trim();
    if (dto.avatar?.trim()) payload.avatar = dto.avatar.trim();

    await this.userRepo.update({id}, payload);
    return this.findById(id);
  }

  async updateDeviceToken(userId: string, token: string): Promise<UserDto> {
    if (!token || !token.trim()) {
      throw new BadRequestException('Token không hợp lệ');
    }

    // Kiểm tra xem user có tồn tại không
    await this.findById(userId);

    await this.userRepo.update({ id: userId }, { device_fcm_token: token.trim() });
    return this.findById(userId);
  }


  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({where: { email }})
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }
}

// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@modules/users/entities/user.entity';
import { UsersService } from '@modules/users/services/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../dto/register.dto';
import { v4 as uuidv4 } from 'uuid';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    //console.log(user);
    if (user && user.is_ban == true) {
      throw new ForbiddenException('Tai khoan cua ban da bi cam');
    }
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async handleGoogleLogin(googleUser: any) {
    const { email, name, picture } = googleUser;

    let user = await this.usersService.findByEmail(email);

    if (!user) {
      // Nếu chưa có user → tạo mới
      user = await this.usersService.create({
        email,
        name,
        password: uuidv4(),
        provider: 'google',
        is_active: true,
      });
    }
    else if (user.is_ban == true) {
      throw new ForbiddenException('Tai khoan cua ban da bi cam!');
    }

    //Tạo JWT token
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
    };
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException('Email da ton tai')
    }

    const hashPassword = await bcrypt.hash(dto.password, 12);
    const user = await this.usersService.create({
      email: dto.email,
      name: dto.name,
      password: hashPassword,
    })

    return {
      id: user.id,
    }
  }

  async resetPassword(email: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(user.id, { password: hashedPassword });
  }
}

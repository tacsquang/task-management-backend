// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service'; // giả định đã có service
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
      access_token: this.jwtService.sign(payload, {
        expiresIn: '1h',
      }),
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
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

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
      message: 'Dang ki thanh cong',
    }
  }
}

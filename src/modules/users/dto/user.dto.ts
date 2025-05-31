import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UserDto {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: 'c28fe77c-1234-4bc5-a789-0aa0eebf9fa1',
  })
  id: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'User activation status',
    example: true,
  })
  is_active: boolean;

  @ApiProperty({
    description: 'URL of the user avatar image',
    example: 'https://example.com/avatar.jpg',
  })
  avatar: string;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.is_active = user.is_active;
    this.avatar = user.avatar ?? '';
  }
}

import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @ApiPropertyOptional({
    description: 'Full name of the user',
    maxLength: 50,
    example: 'John Doe',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'URL of user avatar',
    example: 'https://example.com/avatar.jpg',
  })
  avatar?: string;
}

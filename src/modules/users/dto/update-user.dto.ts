import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @ApiPropertyOptional({
    description: 'Tên đầy đủ của người dùng',
    maxLength: 50,
    example: 'Nguyen Van A',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'URL ảnh đại diện của người dùng',
    example: 'https://example.com/avatar.jpg',
  })
  avatar?: string;
}

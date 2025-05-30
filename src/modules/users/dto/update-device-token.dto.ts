import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDeviceTokenDto {
  @ApiProperty({
    description: 'Firebase Cloud Messaging device token',
    example: 'eJ29fw9nK8JadN...WepM', // bạn có thể đổi ví dụ
  })
  @IsString()
  @IsNotEmpty({ message: 'Device FCM token không được để trống' })
  device_fcm_token: string;
}

import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDeviceTokenDto {
  @ApiProperty({
    description: 'Firebase Cloud Messaging device token',
    example: 'eJ29fw9nK8JadN...WepM', // you can change the example
  })
  @IsString()
  @IsNotEmpty({ message: 'Device FCM token cannot be empty' })
  device_fcm_token: string;
}

import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateDeviceTokenDto {
  @IsString()
  @IsNotEmpty({ message: 'Device FCM token không được để trống' })
  device_fcm_token: string;
}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { initializeFirebase } from './firebase-admin';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return initializeFirebase(configService);
      },
    },
  ],
  exports: ['FIREBASE_ADMIN'],
})
export class FirebaseModule {} 
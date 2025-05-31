import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

export const initializeFirebase = (configService: ConfigService) => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: configService.get('firebase.projectId'),
        privateKey: configService.get('firebase.privateKey')?.replace(/\\n/g, '\n'),
        clientEmail: configService.get('firebase.clientEmail'),
      }),
    });
  }
  return admin;
}; 
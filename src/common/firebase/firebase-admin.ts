import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

export const initializeFirebase = (configService: ConfigService) => {
  if (!admin.apps.length) {
    const projectId = configService.get('firebase.projectId');
    const privateKey = configService.get('firebase.privateKey')?.replace(/\\n/g, '\n');
    const clientEmail = configService.get('firebase.clientEmail');

    if (!projectId || !privateKey || !clientEmail) {
      console.error('Firebase configuration is missing:', {
        projectId: !!projectId,
        privateKey: !!privateKey,
        clientEmail: !!clientEmail,
      });
      throw new Error('Firebase configuration is missing');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        privateKey,
        clientEmail,
      }),
      projectId,
    });
  }
  return admin;
};
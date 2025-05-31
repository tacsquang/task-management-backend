import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from '@modules/notification/services/notification.service';
import { NotificationController } from '@modules/notification/controllers/notification.controller';
import { NotificationCronService } from '@shared/utlis/notification-cron.service';
import { TasksModule } from '@modules/tasks/tasks.module';
import { Notification } from '@modules/notification/entities/notification.entity';
import { FirebaseModule } from '@common/firebase/firebase.module';

@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forFeature([Notification]),
    FirebaseModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationCronService],
  exports: [NotificationService],
})
export class NotificationModule {}

// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { ProjectsModule } from '@modules/projects/projects.module';
import { TasksModule } from '@modules/tasks/tasks.module';
import { TaskGroupsModule } from '@modules/task-groups/task-groups.module';
import { NotificationModule } from '@modules/notification/notification.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailModule } from '@common/email/email.module';
import { FirebaseModule } from '@common/firebase/firebase.module';
import configuration from './config/configuration';
import { getDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),

    ScheduleModule.forRoot(),

    FirebaseModule,
    AuthModule,
    UsersModule,
    TaskGroupsModule,
    ProjectsModule,
    TasksModule,
    NotificationModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

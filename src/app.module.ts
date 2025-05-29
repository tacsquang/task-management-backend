// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { ProjectsModule } from '@modules/projects/projects.module';
import { ProjectMembersModule } from './modules/project-members/project-members.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Có thể inject ConfigService ở bất kỳ đâu
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT', '5432'), 10),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Cân nhắc chuyển thành false trong production
      }),
    }),

    AuthModule,
    UsersModule,
    ProjectsModule,
    ProjectMembersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

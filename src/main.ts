import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Cấu hình CORS
  app.enableCors();
  
  // Cấu hình validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,        // bỏ các field không khai báo trong DTO
    forbidNonWhitelisted: true, // báo lỗi nếu có field lạ
    transform: true,        // tự chuyển đổi types (string => number...)
  }));
  
  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('The Task Management API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Cấu hình phục vụ file tĩnh
  app.useStaticAssets(join(process.cwd(), 'public'));
  
  // Cấu hình phục vụ file từ thư mục gốc
  app.useStaticAssets(process.cwd());
  
  // Cấu hình route mặc định để phục vụ index.html
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/') {
      res.sendFile(join(process.cwd(), 'index.html'));
    } else {
      next();
    }
  });

  await app.listen(process.env.PORT || 8080);
}
bootstrap();

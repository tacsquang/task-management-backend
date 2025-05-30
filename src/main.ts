import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,        // bỏ các field không khai báo trong DTO
    forbidNonWhitelisted: true, // báo lỗi nếu có field lạ
    transform: true,        // tự chuyển đổi types (string => number...)
  }));

    // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('API documentation for Task Management project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

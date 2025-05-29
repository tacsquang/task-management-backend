import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,        // bỏ các field không khai báo trong DTO
    forbidNonWhitelisted: true, // báo lỗi nếu có field lạ
    transform: true,        // tự chuyển đổi types (string => number...)
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

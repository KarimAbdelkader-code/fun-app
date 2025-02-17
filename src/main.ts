import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('FunApp API')
    .setDescription('API for FunApp User Management')
    .setVersion('1.0')
    .addTag('users') // Tag for user endpoints
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Expose Swagger UI on /api

  await app.listen(3000);
}

bootstrap();

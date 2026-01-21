import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Filtro Global de Excepciones
  app.useGlobalFilters(new AllExceptionsFilter());

  // Interceptor Global de Logging
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Activamos validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true, 
      transform: true, 
    }),
  );

  // Habilitar CORS
  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Loan Calculator API')
    .setDescription('API para cálculo de préstamos')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') ?? 3000;
  await app.listen(port);
}
bootstrap();

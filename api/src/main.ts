import 'reflect-metadata';
import { config as loadEnv } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';
import { AppModule } from './app.module';

loadEnv({ path: path.join(__dirname, '..', '.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true });
  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('DSA Studio AI API')
    .setDescription(
      'NestJS backend for DSA Studio AI — catalog, problem content, prep lists, reference docs, solution test runner, and optional OpenAI guidance.',
    )
    .setVersion('1.0')
    .addTag('catalog', 'Topic and problem catalog')
    .addTag('problems', 'Problem content, solutions, and tests')
    .addTag('lists', 'Easy / Medium prep-list coverage')
    .addTag('docs', 'Reference markdown (fundamentals, patterns, cheat sheets)')
    .addTag('ai', 'Optional OpenAI guidance (requires OPENAI_API_KEY)')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/swagger', app, document, {
    jsonDocumentUrl: 'api/swagger-json',
    customSiteTitle: 'DSA Studio AI API',
  });

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
  console.log(`API listening on http://localhost:${port}`);
  console.log(`Swagger UI at http://localhost:${port}/api/swagger`);
}

bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Em produção, substitua pelo domínio do Frontend (ex: 'http://localhost:5173')
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Habilita validação global via DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades que não estejam no DTO
      forbidNonWhitelisted: true, // Retorna erro se enviarem campos extras
      transform: true, // Converte tipos de Query Params automaticamente (ex: string -> number)
    }),
  );
  
  const port = process.env.PORT || 3000;

  await app.listen(port);
  console.log(`🚀 Log Service rodando na porta ${port}`);
}
bootstrap();

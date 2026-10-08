import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
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
  )
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
      queue: process.env.RABBITMQ_QUEUE || 'log_queue',
      noAck: false,
      queueOptions: {
        durable: true,
        deadLetterExchange: 'dlx_log_exchange',
        deadLetterRoutingKey: 'dlq_log_routing_key',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3003);

  console.log('🚀 Incident AI Service rodando na porta 3003');
}
bootstrap();

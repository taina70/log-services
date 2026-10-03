import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = Number(configService.get('PORT')) || 3002;
  const rmqUrl =
    configService.get('RABBITMQ_URL') || 'amqp://guest:guest@localhost:5672';
  const queueName = configService.get('RABBITMQ_QUEUE') || 'log_queue';

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      queue: queueName,
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(port);
  console.log(`🚀 Incident AI Service HTTP em http://localhost:${port}`);
  console.log(`🤖 Incident AI Service escutando fila RabbitMQ [${queueName}]`);
}
bootstrap();

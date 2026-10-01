import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsModule } from './logs/logs.module';
import { IncidentLog } from './logs/entities/incident-log.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'eventpulse_user',
      password: process.env.DB_PASSWORD || 'eventpulse_pass',
      database: process.env.DB_NAME || 'eventpulse_db',
      entities: [IncidentLog],
      synchronize: true, // Apenas para dev
    }),
    LogsModule,
  ],
})
export class AppModule {}

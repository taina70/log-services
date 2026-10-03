import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USER', 'eventpulse_user'),
        password: config.get<string>('DB_PASSWORD', 'eventpulse_pass'),
        database: config.get<string>('DB_NAME', 'eventpulse_db'),
        autoLoadEntities: true, // <-- Mágica do TypeORM: carrega entidades declaradas nos submódulos
        synchronize: config.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    LogsModule,
  ],
})
export class AppModule {}

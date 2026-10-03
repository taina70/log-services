import { Controller, Get, Param } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AnalysisService } from './analysis.service';

@Controller('analyses')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  // Escuta a fila RabbitMQ
  @EventPattern('log_created')
  async handleLogCreated(@Payload() data: any) {
    console.log('📥 Mensagem recebida da fila RabbitMQ:', data.id);
    await this.analysisService.processIncidentLog(data);
  }

  // Rota HTTP GET para buscar todas as análises via Postman
  @Get()
  async findAll() {
    return await this.analysisService.findAll();
  }

  // Rota HTTP GET para buscar a análise de um log específico pelo ID
  @Get('log/:logId')
  async findByLogId(@Param('logId') logId: string) {
    return await this.analysisService.findByLogId(logId);
  }
}

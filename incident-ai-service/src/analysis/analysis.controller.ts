import { Controller, Get, Param, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { AnalysisService } from './analysis.service';

@Controller('analyses')
export class AnalysisController {
  private readonly logger = new Logger(AnalysisController.name);

  constructor(private readonly analysisService: AnalysisService) {}

  @EventPattern('log_created')
  async handleLogCreated(@Payload() data: any, @Ctx() context: any) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      // AJUSTE AQUI: Substitua 'processLogAnalysis' pelo nome exato do método no seu AnalysisService
        await this.analysisService.processIncidentLog(data);
      channel.ack(originalMsg);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`❌ Erro ao processar análise via IA: ${errorMessage}`);

      channel.nack(originalMsg, false, false);
    }
  }

  @Get()
  async findAll() {
    return await this.analysisService.findAll();
  }

  @Get('log/:logId')
  async findByLogId(@Param('logId') logId: string) {
    return await this.analysisService.findByLogId(logId);
  }
}

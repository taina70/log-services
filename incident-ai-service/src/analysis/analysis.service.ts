import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IncidentAnalysis } from './entities/incident-analysis.entity';
import { GeminiService } from './gemini.service';

@Injectable()
export class AnalysisService {
  private readonly logger = new Logger(AnalysisService.name);

  constructor(
    @InjectRepository(IncidentAnalysis)
    private readonly analysisRepository: Repository<IncidentAnalysis>,
    private readonly geminiService: GeminiService,
  ) {}

  async processIncidentLog(logData: any): Promise<IncidentAnalysis> {
    this.logger.log(
      `🤖 Processando análise via Gemini para o log: ${logData.id}`,
    );

    const aiResponse = await this.geminiService.analyzeLog(
      logData.message,
      logData.stackTrace,
    );

    // Validação de resiliência: se a IA falhou (ex: status 503) ou retornou vazia
    if (!aiResponse || !aiResponse.rootCause) {
      throw new Error(
        `Falha na resposta do Gemini para o log ${logData.id}. Rejeitando para DLQ.`,
      );
    }

    const analysis = this.analysisRepository.create({
      logId: logData.id,
      serviceName: logData.serviceName,
      rootCause: aiResponse.rootCause,
      suggestedFix: aiResponse.suggestedFix || 'Verificar logs do sistema',
    });

    const savedAnalysis = await this.analysisRepository.save(analysis);
    this.logger.log(
      `✅ Análise de incidente salva com sucesso! ID: ${savedAnalysis.id}`,
    );

    return savedAnalysis;
  }

  // --- MÉTODOS DE LEITURA (GET) ---

  async findAll(): Promise<IncidentAnalysis[]> {
    return await this.analysisRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByLogId(logId: string): Promise<IncidentAnalysis | null> {
    return await this.analysisRepository.findOne({
      where: { logId },
    });
  }
}

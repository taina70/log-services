import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IncidentAnalysis } from './entities/incident-analysis.entity';
import { GeminiService } from './gemini.service';

@Injectable()
export class AnalysisService {
  constructor(
    @InjectRepository(IncidentAnalysis)
    private readonly analysisRepository: Repository<IncidentAnalysis>,
    private readonly geminiService: GeminiService,
  ) {}

  async processIncidentLog(logData: any): Promise<IncidentAnalysis> {
    console.log(`🤖 Processando análise via Gemini para o log: ${logData.id}`);

    const aiResponse = await this.geminiService.analyzeLog(
      logData.message,
      logData.stackTrace,
    );

    const analysis = this.analysisRepository.create({
      logId: logData.id,
      serviceName: logData.serviceName,
      rootCause: aiResponse.rootCause || 'Não identificada',
      suggestedFix: aiResponse.suggestedFix || 'Verificar logs do sistema',
    });

    const savedAnalysis = await this.analysisRepository.save(analysis);
    console.log(
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

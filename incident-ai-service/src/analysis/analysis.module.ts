import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentAnalysis } from './entities/incident-analysis.entity';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { GeminiService } from './gemini.service';

@Module({
  imports: [TypeOrmModule.forFeature([IncidentAnalysis])],
  controllers: [AnalysisController],
  providers: [AnalysisService, GeminiService],
})
export class AnalysisModule {}

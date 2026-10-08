import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async analyzeLog(
    message: string,
    stackTrace?: string,
  ): Promise<{ rootCause: string; suggestedFix: string }> {
    try {
      const prompt = `Analise este erro e retorne estritamente um JSON com as chaves "rootCause" e "suggestedFix":
      Mensagem: ${message}
      Stack: ${stackTrace || 'N/A'}`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      this.logger.error('Erro ao chamar a API do Gemini:', error);

      // ALTERAÇÃO AQUI: Em vez de retornar um fallback fixo, lançamos o erro.
      // Isso faz o fluxo cair no catch do AnalysisController e acionar o channel.nack(msg, false, false),
      // direcionando o evento com falha para a DLQ.
      throw new Error(
        `Gemini API indisponível: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}

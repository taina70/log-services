import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GeminiService {
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
      console.error('Erro ao chamar a API do Gemini:', error);
      return {
        rootCause: 'Falha na comunicação com a API de IA',
        suggestedFix:
          'Verificar a chave de API e a disponibilidade do serviço Gemini',
      };
    }
  }
}

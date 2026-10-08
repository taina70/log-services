# 🚀 Distributed Log Analysis & Incident AI System

Sistema de microsserviços em **NestJS** e **RabbitMQ** projetado para coleta, enfileiramento e análise automática de logs de erro em tempo real utilizando a API do **Google Gemini AI**.

---

## 🏗️ Arquitetura do Sistema

```text
[ Aplicação / Cliente ]
          │ (HTTP POST)
          ▼
┌──────────────────┐      (Evento)      ┌──────────────┐
│   log-service    │ ─────────────────> │   RabbitMQ   │
│   (Porta 3000)   │  log_created       │ (log_queue)  │
└──────────────────┘                    └──────┬───────┘
                                               │
                                      (Consume)│
                                               ▼
┌──────────────────┐    (Análise)       ┌─────────────────────────┐
│ Google Gemini AI │ <────────────────> │   incident-ai-service   │
│ (gemini-3.8-flash)│                   │      (Porta 3003)       │
└──────────────────┘                    └────────────┬────────────┘
                                                     │ (Persistência)
                                                     ▼
                                            ┌──────────────────┐
                                            │  Banco de Dados  │
                                            │ (PostgreSQL/MySQL│
                                            └──────────────────┘

🛠️ Tecnologias Utilizadas
Framework: NestJS (Node.js)

Message Broker: RabbitMQ (com suporte a Dead Letter Queue - DLQ)

IA Generativa: Google Gemini API (gemini-3.8-flash)

ORM: TypeORM

Validação: class-validator & class-transformer

Linguagem: TypeScript

⚙️ Funcionalidades e Resiliência
Processamento Assíncrono: Emissão de eventos decoupled via RabbitMQ.

Análise Inteligente de Erros: Identificação automática da causa raiz e sugestão de correção via IA.

Tratamento de Falhas (Ack / Nack Manual):

Confirmação (ack) do evento apenas após o sucesso da análise e gravação no banco.

Rejeição sem requeue (nack(msg, false, false)) em falhas da API da IA (ex: HTTP 503), direcionando o evento automaticamente para a Dead Letter Queue (DLQ) (dlq_log_queue).

Endpoints com Paginação e Filtros: Consulta otimizada das análises de incidentes para consumo via Frontend.

🚦 Como Executar o Projeto
Pré-requisitos
Node.js (v18+)

Docker & Docker Compose (para o RabbitMQ e Banco de Dados)

Chave de API do Google Gemini (GEMINI_API_KEY)

1. Subir a Infraestrutura (RabbitMQ & Database)
Execute o container do RabbitMQ via Docker:

Bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

2. Configurar Variáveis de Ambiente (.env)
Crie o arquivo .env no diretório de cada microsserviço:

log-service/.env
Snippet de código
PORT=3000
RABBITMQ_URL=amqp://localhost:5672
incident-ai-service/.env
Snippet de código
PORT=3003
RABBITMQ_URL=amqp://localhost:5672
GEMINI_API_KEY=sua_chave_gemini_aqui
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=incident_db
3. Instalar Dependências e Iniciar os Serviços
Em terminais separados:

Bash
# Executar o Log Service
cd log-service
npm install
npm run start:dev
Bash
# Executar o Incident AI Service
cd incident-ai-service
npm install
npm run start:dev
🧪 Testando a Aplicação
1. Disparar um Novo Log de Erro
Bash
curl -X POST http://localhost:3000/logs \
  -H "Content-Type: application/json" \
  -d '{
    "serviceName": "payment-api",
    "severity": "CRITICAL",
    "message": "ConnectionTimeout: Failed to connect to Redis cache on 10.0.0.12:6379"
  }'
2. Consultar Incidentes Analisados pela IA
Bash
# Listar todas as análises (com paginação)
curl "http://localhost:3003/analyses?page=1&limit=10"

# Filtrar análises por nome do serviço
curl "http://localhost:3003/analyses?serviceName=payment-api"


📌 Principais Endpoints
Serviço	Método	Endpoint	Descrição
Log Service	POST	/logs	Registra um log e emite evento ao RabbitMQ
Incident AI Service	GET	/analyses	Lista incidentes analisados (suporta page, limit, serviceName)
Incident AI Service	GET	/analyses/log/:logId	Busca análise detalhada de um log específico

<FollowUp label="Quer adicionar alguma seção extra ao README, como scripts de teste ou Docker Compose?" query="Como criar um arquivo docker-compose.yml para subir todo o ambiente (RabbitMQ, Banco de Dados e os dois serviços) com um único comando?"/>
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('incident_analyses')
export class IncidentAnalysis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  logId: string;

  @Column()
  serviceName: string;

  @Column({ type: 'text' })
  rootCause: string;

  @Column({ type: 'text' })
  suggestedFix: string;

  @Column({ default: 'HIGH' })
  severityScore: string;

  @CreateDateColumn()
  createdAt: Date;
}

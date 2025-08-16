import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from './project.entity';

@Entity('units')
export class Unit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  project_id: number;

  @Column()
  code: string;

  @Column()
  type: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  area: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  base_price: number;

  @Column()
  status: string; // e.g., 'available', 'reserved', 'sold'

  @Column({ nullable: true })
  current_owner_contract_id: number;

  @ManyToOne(() => Project, (project) => project.units)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}

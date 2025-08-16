import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Unit } from './unit.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  phase: string;

  @Column()
  status: string;

  @Column({ type: 'date', nullable: true })
  start_date: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  budget: number;

  @OneToMany(() => Unit, (unit) => unit.project)
  units: Unit[];
}

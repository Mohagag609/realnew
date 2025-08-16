import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { Unit } from './entities/unit.entity';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
  ) {}

  create(createUnitDto: CreateUnitDto): Promise<Unit> {
    const unit = this.unitRepository.create(createUnitDto);
    return this.unitRepository.save(unit);
  }

  findAll(): Promise<Unit[]> {
    return this.unitRepository.find();
  }

  async findOne(id: number): Promise<Unit> {
    const unit = await this.unitRepository.findOneBy({ id });
    if (!unit) {
      throw new NotFoundException(`Unit with ID "${id}" not found`);
    }
    return unit;
  }

  async update(id: number, updateUnitDto: UpdateUnitDto): Promise<Unit> {
    const unit = await this.unitRepository.preload({
      id: id,
      ...updateUnitDto,
    });
    if (!unit) {
      throw new NotFoundException(`Unit with ID "${id}" not found`);
    }
    return this.unitRepository.save(unit);
  }

  async remove(id: number): Promise<void> {
    const result = await this.unitRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Unit with ID "${id}" not found`);
    }
  }
}

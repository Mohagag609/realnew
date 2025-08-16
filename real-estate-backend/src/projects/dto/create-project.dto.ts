import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  phase?: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsDateString()
  @IsOptional()
  start_date?: string;

  @IsNumber()
  @IsOptional()
  budget?: number;
}

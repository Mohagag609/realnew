import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateUnitDto {
  @IsNumber()
  @IsNotEmpty()
  project_id: number;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @IsNotEmpty()
  area: number;

  @IsNumber()
  @IsNotEmpty()
  base_price: number;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsNumber()
  @IsOptional()
  current_owner_contract_id?: number;
}

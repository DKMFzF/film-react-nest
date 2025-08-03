import { IsString, IsArray, IsNumber, IsNotEmpty } from 'class-validator';

export class OrderDto {
  @IsString()
  @IsNotEmpty()
  filmId: string;

  @IsString()
  @IsNotEmpty()
  scheduleId: string;

  @IsArray()
  @IsString({ each: true })
  seats: string[];

  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;
}
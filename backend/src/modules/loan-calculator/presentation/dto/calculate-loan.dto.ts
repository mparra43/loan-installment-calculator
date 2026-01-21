import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsPositive, IsInt, Min } from 'class-validator'

export class CalculateLoanDto {
  @ApiProperty({ type: Number, example: 10000, description: 'Monto del préstamo en unidades monetarias' })
  @IsNumber()
  @IsPositive()
  amount!: number

  @ApiProperty({ type: Number, example: 0.12, description: 'Tasa de interés anual en forma decimal (p. ej., 0.12 = 12%)' })
  @IsNumber()
  @Min(0)
  interestRate!: number

  @ApiProperty({ type: Number, example: 24, description: 'Plazo del préstamo en meses' })
  @IsInt()
  @IsPositive()
  termInMonths!: number
}
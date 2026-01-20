import { ApiProperty } from '@nestjs/swagger'

export class CalculateLoanDto {
  @ApiProperty({ type: Number, example: 10000, description: 'Monto del préstamo en unidades monetarias' })
  amount!: number

  @ApiProperty({ type: Number, example: 0.12, description: 'Tasa de interés anual en forma decimal (p. ej., 0.12 = 12%)' })
  interestRate!: number

  @ApiProperty({ type: Number, example: 24, description: 'Plazo del préstamo en meses' })
  termInMonths!: number
}
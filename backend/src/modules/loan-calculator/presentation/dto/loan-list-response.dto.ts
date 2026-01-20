import { ApiProperty } from '@nestjs/swagger'

export class LoanListResponseDto {
  @ApiProperty({ type: Number, example: 10000, description: 'Monto del préstamo' })
  amount!: number

  @ApiProperty({ type: Number, example: 24, description: 'Plazo en meses' })
  termMonths!: number

  @ApiProperty({ type: Number, example: 0.12, description: 'Tasa de interés anual (decimal)' })
  interestRate!: number

  @ApiProperty({ type: String, example: 'fixed', description: 'Tipo de interés (p. ej., fixed, variable)' })
  interestType!: string

  @ApiProperty({ type: Number, example: 1272.8, description: 'Total de intereses' })
  totalInterest!: number

  @ApiProperty({ type: Number, example: 11272.8, description: 'Total pagado (principal + intereses)' })
  totalPayment!: number

  @ApiProperty({ type: Number, example: 469.7, description: 'Cuota mensual' })
  monthlyPayment!: number
}
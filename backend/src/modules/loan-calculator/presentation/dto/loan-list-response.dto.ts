import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class LoanListResponseDto {
  @ApiProperty({ type: Number, example: 10000, description: 'Monto del préstamo' })
  @IsNumber()
  amount!: number

  @ApiProperty({ type: Number, example: 24, description: 'Plazo en meses' })
  @IsNumber()
  termMonths!: number

  @ApiProperty({ type: Number, example: 0.12, description: 'Tasa de interés anual (decimal)' })
  @IsNumber()
  interestRate!: number

  @ApiProperty({ type: String, example: 'fixed', description: 'Tipo de interés (p. ej., fixed, variable)' })
  @IsString()
  interestType!: string

  @ApiProperty({ type: Number, example: 1272.8, description: 'Total de intereses' })
  @IsNumber()
  totalInterest!: number

  @ApiProperty({ type: Number, example: 11272.8, description: 'Total pagado (principal + intereses)' })
  @IsNumber()
  totalPayment!: number

  @ApiProperty({ type: Number, example: 469.7, description: 'Cuota mensual' })
  @IsNumber()
  monthlyPayment!: number
}
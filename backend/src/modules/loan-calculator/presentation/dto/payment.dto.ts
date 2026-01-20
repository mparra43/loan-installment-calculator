import { ApiProperty } from '@nestjs/swagger'

export class PaymentDto {
  @ApiProperty({ type: Number, example: 1, description: 'Número de mes dentro del cronograma (1..N)' })
  month!: number

  @ApiProperty({ type: Number, example: 469.7, description: 'Pago total del mes (principal + interés)' })
  payment!: number

  @ApiProperty({ type: Number, example: 369.7, description: 'Porción del pago que amortiza capital' })
  principal!: number

  @ApiProperty({ type: Number, example: 100.0, description: 'Porción del pago correspondiente a intereses' })
  interest!: number

  @ApiProperty({ type: Number, example: 9630.3, description: 'Saldo pendiente tras el pago de este mes' })
  balance!: number
}
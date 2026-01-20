import { ApiProperty } from '@nestjs/swagger'
import { PaymentDto } from './payment.dto'

export class LoanResponseDto {
    @ApiProperty({ type: Number, example: 11272.8, description: 'Suma de todos los pagos (principal + intereses)' })
    totalAmount!: number

    @ApiProperty({ type: Number, example: 469.7, description: 'Pago mensual calculado' })
    monthlyPayment!: number

    @ApiProperty({ type: Number, example: 1272.8, description: 'Total de intereses pagados' })
    totalInterest!: number

    @ApiProperty({ type: [PaymentDto], description: 'Cronograma de pagos mensuales' })
    payments!: PaymentDto[]
}
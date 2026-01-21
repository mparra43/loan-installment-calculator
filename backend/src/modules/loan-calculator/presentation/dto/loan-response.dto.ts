import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, ValidateNested, IsArray } from 'class-validator'
import { Type } from 'class-transformer'
import { PaymentDto } from './payment.dto'

export class LoanResponseDto {
    @ApiProperty({ type: Number, example: 11272.8, description: 'Suma de todos los pagos (principal + intereses)' })
    @IsNumber()
    totalAmount!: number

    @ApiProperty({ type: Number, example: 469.7, description: 'Pago mensual calculado' })
    @IsNumber()
    monthlyPayment!: number

    @ApiProperty({ type: Number, example: 1272.8, description: 'Total de intereses pagados' })
    @IsNumber()
    totalInterest!: number

    @ApiProperty({ type: [PaymentDto], description: 'Cronograma de pagos mensuales' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PaymentDto)
    payments!: PaymentDto[]
}
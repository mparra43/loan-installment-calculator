import { Module } from '@nestjs/common'
import { LoanCalculatorController } from './presentation/controllers/loan-calculator.controller'
import { LoanCalculatorService } from './application/services/loan-calculator.service'

@Module({
  controllers: [LoanCalculatorController],
  providers: [LoanCalculatorService],
})
export class LoanCalculatorModule {}

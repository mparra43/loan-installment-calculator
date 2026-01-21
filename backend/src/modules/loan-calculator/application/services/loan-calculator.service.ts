import { Injectable, Logger } from '@nestjs/common'
import { LoanCalculation } from '@modules/loan-calculator/domain/entities/loan-calculation.entity'
import { LoanCalculationRepository } from '@modules/loan-calculator/domain/ports/loan-calculation.interface'
import { CalculateLoanDto } from '@modules/loan-calculator/presentation/dto/calculate-loan.dto'
import { LoanResponseDto } from '@modules/loan-calculator/presentation/dto/loan-response.dto'
import { PaymentDto } from '@modules/loan-calculator/presentation/dto/payment.dto'
import { LoanListResponseDto } from '@modules/loan-calculator/presentation/dto/loan-list-response.dto'
import { TypeOrmLoanCalculationRepository } from '@infrastructure/database/repositories/loan-calculation.typeorm.repository'
import { CacheService } from '@infrastructure/cache/service/cache.service'

@Injectable()
export class LoanCalculatorService {
  constructor(
    private readonly repo: TypeOrmLoanCalculationRepository,
    private readonly cacheService: CacheService,
  ) {}

  async calculate(input: CalculateLoanDto): Promise<LoanResponseDto> {
    const cacheKey = `loan_calc_${input.amount}_${input.interestRate}_${input.termInMonths}`
    const cachedResult = await this.cacheService.get<LoanResponseDto>(cacheKey)
    if (cachedResult) {
      return cachedResult
    }

    const domain = LoanCalculation.create({
      amount: input.amount,
      interestRate: input.interestRate,
      termInMonths: input.termInMonths,
    })

    await this.repo.save(domain)

    const payments: PaymentDto[] = domain.payments.map(p => ({
      month: p.month,
      payment: p.payment,
      principal: p.principal,
      interest: p.interest,
      balance: p.balance,
    }))

    const result: LoanResponseDto = {
      totalAmount: domain.totalAmount,
      monthlyPayment: domain.monthlyPayment,
      totalInterest: domain.totalInterest,
      payments,
    }

    await this.cacheService.set(cacheKey, result)

    return result
  }

  async findAll(): Promise<LoanListResponseDto[]> {
    const items = await this.repo.list()
    return items.map(d => ({
      amount: d.amount,
      termMonths: d.termInMonths,
      interestRate: d.interestRate,
      interestType: 'fixed',
      totalInterest: d.totalInterest,
      totalPayment: d.totalAmount,
      monthlyPayment: d.monthlyPayment,
    }))
  }
}
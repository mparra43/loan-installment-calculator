import { Injectable, Logger, Inject } from '@nestjs/common'
import { LoanCalculation } from '@modules/loan-calculator/domain/entities/loan-calculation.entity'
import type { LoanCalculationRepository } from '@modules/loan-calculator/domain/ports/loan-calculation.interface'
import { CalculateLoanDto } from '@modules/loan-calculator/presentation/dto/calculate-loan.dto'
import { LoanResponseDto } from '@modules/loan-calculator/presentation/dto/loan-response.dto'
import { PaymentDto } from '@modules/loan-calculator/presentation/dto/payment.dto'
import { LoanListResponseDto } from '@modules/loan-calculator/presentation/dto/loan-list-response.dto'
import { CacheService } from '@infrastructure/cache/service/cache.service'

@Injectable()
export class LoanCalculatorService {
  private readonly logger = new Logger(LoanCalculatorService.name);

  constructor(
    @Inject('LoanCalculationRepository')
    private readonly repo: LoanCalculationRepository,
    private readonly cacheService: CacheService,
  ) {}

  async calculate(input: CalculateLoanDto): Promise<LoanResponseDto> {
    const cacheKey = `loan_calc_${input.amount}_${input.interestRate}_${input.termInMonths}`
    
    // Try to get from cache (Fail-safe)
    try {
      const cachedResult = await this.cacheService.get<LoanResponseDto>(cacheKey)
      if (cachedResult) {
        this.logger.debug(`Cache HIT for key: ${cacheKey}`)
        return cachedResult
      }
    } catch (error) {
      this.logger.warn(`Cache GET failed for key: ${cacheKey} - Continuing execution`, error instanceof Error ? error.stack : '')
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

    // Try to set cache (Fail-safe)
    try {
      await this.cacheService.set(cacheKey, result)
    } catch (error) {
      this.logger.warn(`Cache SET failed for key: ${cacheKey}`, error instanceof Error ? error.stack : '')
    }

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
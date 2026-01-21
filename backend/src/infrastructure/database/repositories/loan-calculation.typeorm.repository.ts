import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { LoanCalculationEntity } from '../entities/loan-calculation.typeorm.entity'
import { LoanCalculationRepository } from '../../../modules/loan-calculator/domain/ports/loan-calculation.interface'
import { LoanCalculation } from '../../../modules/loan-calculator/domain/entities/loan-calculation.entity'

@Injectable()
export class TypeOrmLoanCalculationRepository implements LoanCalculationRepository {
  private readonly logger = new Logger(TypeOrmLoanCalculationRepository.name);

  constructor(
    @InjectRepository(LoanCalculationEntity)
    private readonly repo: Repository<LoanCalculationEntity>,
  ) {}

  async save(domain: LoanCalculation): Promise<void> {
    try {
      const entity = this.toEntity(domain)
      await this.repo.save(entity)
      this.logger.debug(`Saved loan calculation with ID: ${domain.id}`)
    } catch (error) {
      this.logger.error(`Failed to save loan calculation with ID: ${domain.id}`, error instanceof Error ? error.stack : '')
      throw error
    }
  }

  async findById(id: string): Promise<LoanCalculation | null> {
    try {
      const entity = await this.repo.findOne({ where: { id } })
      return entity ? this.toDomain(entity) : null
    } catch (error) {
      this.logger.error(`Failed to find loan calculation with ID: ${id}`, error instanceof Error ? error.stack : '')
      throw error
    }
  }

  async list(): Promise<LoanCalculation[]> {
    try {
      const rows = await this.repo.find({ order: { createdAt: 'DESC' } })
      return rows.map(r => this.toDomain(r))
    } catch (error) {
      this.logger.error('Failed to list loan calculations', error instanceof Error ? error.stack : '')
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.repo.delete({ id })
      this.logger.debug(`Deleted loan calculation with ID: ${id}`)
    } catch (error) {
      this.logger.error(`Failed to delete loan calculation with ID: ${id}`, error instanceof Error ? error.stack : '')
      throw error
    }
  }

  private toEntity(d: LoanCalculation): LoanCalculationEntity {
    const e = new LoanCalculationEntity()
    e.id = d.id
    e.amount = d.amount
    e.termMonths = d.termInMonths
    e.interestRate = d.interestRate
    e.interestType = 'fixed'
    e.monthlyPayment = d.monthlyPayment
    e.totalInterest = d.totalInterest
    e.totalPayment = d.totalAmount
    e.createdAt = d.createdAt
    return e
  }

  private toDomain(e: LoanCalculationEntity): LoanCalculation {
    // Reconstituye sin cronograma (payments), que no se persiste en esta tabla.
    return LoanCalculation.create({
      id: e.id,
      amount: e.amount,
      interestRate: e.interestRate,
      termInMonths: e.termMonths,
    })
  }
}
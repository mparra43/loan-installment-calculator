import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { LoanCalculationEntity } from '../entities/loan-calculation.typeorm.entity'
import { LoanCalculationRepository } from '../../../modules/loan-calculator/domain/repositories/loan-calculation.repository.interface'
import { LoanCalculation } from '../../../modules/loan-calculator/domain/entities/loan-calculation.entity'

@Injectable()
export class TypeOrmLoanCalculationRepository implements LoanCalculationRepository {
  constructor(
    @InjectRepository(LoanCalculationEntity)
    private readonly repo: Repository<LoanCalculationEntity>,
  ) {}

  async save(domain: LoanCalculation): Promise<void> {
    const entity = this.toEntity(domain)
    await this.repo.save(entity)
  }

  async findById(id: string): Promise<LoanCalculation | null> {
    const entity = await this.repo.findOne({ where: { id } })
    return entity ? this.toDomain(entity) : null
  }

  async list(): Promise<LoanCalculation[]> {
    const rows = await this.repo.find({ order: { createdAt: 'DESC' } })
    return rows.map(r => this.toDomain(r))
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete({ id })
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
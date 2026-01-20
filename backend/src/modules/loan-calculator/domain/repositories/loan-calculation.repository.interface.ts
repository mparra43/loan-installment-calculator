import { LoanCalculation } from '../entities/loan-calculation.entity'

export interface LoanCalculationRepository {
  save(entity: LoanCalculation): Promise<void>
  findById(id: string): Promise<LoanCalculation | null>
  list(): Promise<LoanCalculation[]>
  delete(id: string): Promise<void>
}
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('loan_calculations')
export class LoanCalculationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'double precision' })
  amount!: number

  @Column({ type: 'int' })
  termMonths!: number

  @Column({ type: 'double precision' })
  interestRate!: number

  @Column({ type: 'varchar', length: 32 })
  interestType!: string

  @Column({ type: 'double precision' })
  monthlyPayment!: number

  @Column({ type: 'double precision' })
  totalInterest!: number

  @Column({ type: 'double precision' })
  totalPayment!: number

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date
}
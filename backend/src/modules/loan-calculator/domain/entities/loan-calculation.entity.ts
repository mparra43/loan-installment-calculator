import { PaymentVO } from '../value-objects/payment.vo'

export class LoanCalculation {
  readonly id: string
  readonly amount: number
  readonly interestRate: number
  readonly termInMonths: number
  readonly totalAmount: number
  readonly monthlyPayment: number
  readonly totalInterest: number
  readonly payments: PaymentVO[]
  readonly createdAt: Date

  private constructor(
    id: string,
    amount: number,
    interestRate: number,
    termInMonths: number,
    monthlyPayment: number,
    payments: PaymentVO[],
    totalAmount: number,
    totalInterest: number,
    createdAt: Date,
  ) {
    this.id = id
    this.amount = amount
    this.interestRate = interestRate
    this.termInMonths = termInMonths
    this.monthlyPayment = monthlyPayment
    this.payments = payments
    this.totalAmount = totalAmount
    this.totalInterest = totalInterest
    this.createdAt = createdAt
    Object.freeze(this)
  }

  static create(params: { id?: string; amount: number; interestRate: number; termInMonths: number }): LoanCalculation {
    const { id, amount, interestRate, termInMonths } = params
    if (!Number.isFinite(amount) || amount <= 0) throw new Error('amount inválido')
    if (!Number.isFinite(interestRate) || interestRate < 0) throw new Error('interestRate inválido')
    if (!Number.isFinite(termInMonths) || termInMonths <= 0) throw new Error('termInMonths inválido')

    const monthlyRate = interestRate / 12
    const monthlyPayment = round2(monthlyRate === 0 ? amount / termInMonths : (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termInMonths)))

    let balance = amount
    const payments: PaymentVO[] = []
    let interestSum = 0
    let paymentSum = 0

    for (let m = 1; m <= termInMonths; m++) {
      const interest = round2(balance * monthlyRate)
      let principal = round2(monthlyPayment - interest)
      if (m === termInMonths) {
        principal = round2(balance)
      }
      const payment = round2(principal + interest)
      balance = round2(balance - principal)
      payments.push(PaymentVO.create({ month: m, payment, principal, interest, balance }))
      interestSum = round2(interestSum + interest)
      paymentSum = round2(paymentSum + payment)
    }

    return new LoanCalculation(
      id ?? randomId(),
      round2(amount),
      interestRate,
      termInMonths,
      monthlyPayment,
      payments,
      paymentSum,
      interestSum,
      new Date(),
    )
  }
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function randomId() {
  if (typeof (globalThis as any).crypto?.randomUUID === 'function') return (globalThis as any).crypto.randomUUID()
  return 'id-' + Math.random().toString(36).slice(2)
}
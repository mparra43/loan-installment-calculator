export class PaymentVO {
  readonly month: number
  readonly payment: number
  readonly principal: number
  readonly interest: number
  readonly balance: number

  private constructor(month: number, payment: number, principal: number, interest: number, balance: number) {
    this.month = month
    this.payment = payment
    this.principal = principal
    this.interest = interest
    this.balance = balance
    Object.freeze(this)
  }

  static create(params: { month: number; payment: number; principal: number; interest: number; balance: number }): PaymentVO {
    const { month, payment, principal, interest, balance } = params
    if (!Number.isFinite(month) || month < 1) throw new Error('month inválido')
    for (const v of [payment, principal, interest, balance]) {
      if (!Number.isFinite(v) || v < 0) throw new Error('valor inválido')
    }
    const epsilon = 0.01
    if (Math.abs((principal + interest) - payment) > epsilon) throw new Error('payment debe ser principal + interest')
    return new PaymentVO(month, round2(payment), round2(principal), round2(interest), round2(balance))
  }

  toJSON() {
    return { month: this.month, payment: this.payment, principal: this.principal, interest: this.interest, balance: this.balance }
  }
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}
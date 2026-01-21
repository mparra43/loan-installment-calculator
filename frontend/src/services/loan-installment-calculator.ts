import { apiClient } from './base-api'

// DTOs espejados del backend
export interface PaymentDto {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
}

export interface LoanResponseDto {
  totalAmount: number
  monthlyPayment: number
  totalInterest: number
  payments: PaymentDto[]
}

export interface LoanListResponseDto {
  amount: number
  termMonths: number
  interestRate: number
  interestType: string
  totalInterest: number
  totalPayment: number
  monthlyPayment: number
}

export interface CalculateLoanDto {
  amount: number
  interestRate: number
  termInMonths: number
}

export const loanService = {
  createLoan: async (data: CalculateLoanDto): Promise<LoanResponseDto> => {
    return apiClient.post<LoanResponseDto>('/loans', data)
  },

  getLoanHistory: async (): Promise<LoanListResponseDto[]> => {
    return apiClient.get<LoanListResponseDto[]>('/loans')
  },
}
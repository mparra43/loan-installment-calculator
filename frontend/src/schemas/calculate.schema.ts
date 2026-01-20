import { z } from 'zod'

export const calculateLoanSchema = z.object({
  amount: z.number().positive(),
  interestRate: z.number().min(0),
  termInMonths: z.number().int().positive(),
})

export type CalculateLoanInput = z.infer<typeof calculateLoanSchema>
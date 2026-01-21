import { useState } from 'react'
import { Form } from '../components/Form'
import { calculateLoanSchema } from '../schemas/calculate.schema'
import { Table } from '../components/Table'
import { loanService, type LoanResponseDto, type PaymentDto } from '../services/loan-installment-calculator'

export function HomePage() {
  const [state, setState] = useState<LoanResponseDto | null>(null)

  const handleSubmit = async (data: any) => {
    try {
      const response = await loanService.createLoan({
        amount: Number(data.amount),
        interestRate: Number(data.interestRate),
        termInMonths: Number(data.termInMonths),
      })
      setState(response)
    } catch (error) {
      console.error('Error calculating loan:', error)
      // Aquí podrías agregar lógica para mostrar el error al usuario
    }
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-semibold">Calculadora de Préstamos</h1>
      <div className='w-10/12 flex justify-center pt-8'>
        <Form
          schema={calculateLoanSchema}
          fields={[
            { label: 'Monto', name: 'amount', type: 'number', inputType: 'text', placeholder: 'Ej: 10000' },
            { label: 'Tasa de interés mensual (decimal)', name: 'interestRate', type: 'number', inputType: 'text', placeholder: 'Ej: 0.01' },
            { label: 'Plazo (meses)', name: 'termInMonths', type: 'number', inputType: 'text', placeholder: 'Ej: 24' },
          ]}
          buttonProps={{ label: 'Calcular', type: 'submit', variant: 'primary' }}
          onSubmit={handleSubmit}
        />
      </div>
      {state && (
        <div className="w-10/12">
          <div className="grid grid-cols-3 gap-4 py-8">
            <div className="p-4 bg-white rounded-md border">
              <p className="text-sm text-gray-500">Pago mensual</p>
              <p className="text-xl font-semibold">{state.monthlyPayment.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-white rounded-md border">
              <p className="text-sm text-gray-500">Total intereses</p>
              <p className="text-xl font-semibold">{state.totalInterest.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-white rounded-md border">
              <p className="text-sm text-gray-500">Total pagado</p>
              <p className="text-xl font-semibold">{state.totalAmount.toFixed(2)}</p>
            </div>
          </div>
          <Table<PaymentDto>
            columns={[
              { key: 'month', header: 'Mes' },
              { key: 'payment', header: 'Pago', format: (v) => Number(v).toFixed(2) },
              { key: 'principal', header: 'Capital', format: (v) => Number(v).toFixed(2) },
              { key: 'interest', header: 'Interés', format: (v) => Number(v).toFixed(2) },
              { key: 'balance', header: 'Saldo', format: (v) => Number(v).toFixed(2) },
            ]}
            data={state.payments}
          />
        </div>
      )}
    </div>
  )
}
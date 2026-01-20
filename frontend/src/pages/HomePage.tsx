import { Form } from '../components/Form'
import { calculateLoanSchema } from '../schemas/calculate.schema'
import { Table } from '../components/Table'

type Payment = { month: number; payment: number; principal: number; interest: number; balance: number }
type LoanResponse = { totalAmount: number; monthlyPayment: number; totalInterest: number; payments: Payment[] }

const API = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

export function HomePage() {
  const handleSubmit = async (data: any) => {
    const res = await fetch(`${API}/loans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: Number(data.amount),
        interestRate: Number(data.interestRate),
        termInMonths: Number(data.termInMonths),
      }),
    })
    const json: LoanResponse = await res.json()
    setState(json)
  }

  const [state, setState] = useState<LoanResponse | null>(null)

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Calculadora de Préstamos</h1>
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
      {state && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
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
          <Table<Payment>
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
import { useState } from 'react'
import { useEffect, useState } from 'react'
import { Table } from '../components/Table'
import { loanService, type LoanListResponseDto } from '../services/loan-installment-calculator'

export function HistoryPage() {
  const [data, setData] = useState<LoanListResponseDto[]>([])
  useEffect(() => {
    loanService.getLoanHistory()
      .then(setData)
      .catch((error) => {
        console.error('Error fetching history:', error)
        setData([])
      })
  }, [])

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-semibold pb-8">Historial</h1>
      <Table<LoanListResponseDto>
        columns={[
          { key: 'amount', header: 'Monto', format: (v) => Number(v).toFixed(2) },
          { key: 'termMonths', header: 'Meses' },
          { key: 'interestRate', header: 'Tasa', format: (v) => Number(v).toFixed(4) },
          { key: 'interestType', header: 'Tipo' },
          { key: 'monthlyPayment', header: 'Mensual', format: (v) => Number(v).toFixed(2) },
          { key: 'totalInterest', header: 'Interés total', format: (v) => Number(v).toFixed(2) },
          { key: 'totalPayment', header: 'Total', format: (v) => Number(v).toFixed(2) },
        ]}
        data={data}
      />
    </div>
  )
}
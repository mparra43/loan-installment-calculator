import { useEffect, useState } from 'react'
import { Table } from '../components/Table'

type Row = {
  amount: number
  termMonths: number
  interestRate: number
  interestType: string
  totalInterest: number
  totalPayment: number
  monthlyPayment: number
}

const API = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

export function HistoryPage() {
  const [data, setData] = useState<Row[]>([])
  useEffect(() => {
    fetch(`${API}/loans`).then(r => r.json()).then(setData).catch(() => setData([]))
  }, [])

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Historial</h1>
      <Table<Row>
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
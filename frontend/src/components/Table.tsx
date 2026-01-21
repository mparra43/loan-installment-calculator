type Column<T> = { key: keyof T; header: string; format?: (v: any) => string }

interface Props<T> {
  columns: Column<T>[]
  data: T[]
}

export function Table<T extends Record<string, any>>({ columns, data }: Props<T>) {
  return (
    <div className="overflow-x-auto rounded-md border border-gray-200 max-h-[20rem] overflow-y-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            {columns.map((c) => (
              <th key={String(c.key)} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {columns.map((c) => {
                const raw = row[c.key]
                const val = c.format ? c.format(raw) : String(raw)
                return <td key={String(c.key)} className="px-4 py-2 text-sm text-gray-700">{val}</td>
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
import { ReactNode } from 'react'
import { Card } from './Card'

export interface CompareRow {
  label: string
  values: (string | number | ReactNode)[]
}

export interface CompareTableProps {
  rows: CompareRow[]
  headers: string[]
}

export default function CompareTable({ rows, headers }: CompareTableProps) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Feature</th>
              {headers.map((header, i) => (
                <th key={i} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="px-4 py-3 text-sm font-medium text-gray-700">{row.label}</td>
                {row.values.map((value, j) => (
                  <td key={j} className="px-4 py-3 text-sm text-gray-600">
                    {typeof value === 'string' || typeof value === 'number' ? value : value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}


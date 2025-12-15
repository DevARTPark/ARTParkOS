import React, { ReactNode } from "react";
import { Card } from "./Card";

export interface CompareRow {
  label: string;
  values: (string | number | ReactNode)[];
}

export interface CompareTableProps {
  rows: CompareRow[];
  headers: string[];
}

export default function CompareTable({ rows, headers }: CompareTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Feature
              </th>
              {headers.map((header, i) => (
                <th
                  key={i}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-l border-gray-200"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-700">
                  {row.label}
                </td>
                {row.values.map((value, j) => (
                  <td
                    key={j}
                    className="px-6 py-4 text-sm text-gray-600 border-l border-gray-100"
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

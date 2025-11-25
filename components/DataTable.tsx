
import React, { useState, useMemo } from 'react';
import { DataRow, SortConfig } from '../types';
import { TableIcon, ArrowUpIcon, ArrowDownIcon } from './Icons';

interface DataTableProps {
  headers: string[];
  data: DataRow[];
}

const DataTable: React.FC<DataTableProps> = ({ headers, data }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        
        if (valA == null) return 1;
        if (valB == null) return -1;

        if (valA < valB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="bg-brand-surface rounded-xl shadow-lg">
      <div className="p-6 border-b border-slate-700">
        <h3 className="text-xl font-semibold flex items-center gap-2">
            <TableIcon /> Data Preview
        </h3>
        <p className="text-sm text-brand-text-secondary">Showing all {data.length} records.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-brand-text-secondary">
          <thead className="text-xs text-brand-text-primary uppercase bg-slate-700 sticky top-16 z-10">
            <tr>
              {headers.map((header) => (
                <th key={header} scope="col" className="px-6 py-3">
                  <button onClick={() => requestSort(header)} className="flex items-center gap-1 hover:text-white transition-colors group">
                    {header}
                    {sortConfig?.key === header ? (
                      sortConfig.direction === 'ascending' ? <ArrowUpIcon /> : <ArrowDownIcon />
                    ) : (
                      <span className="opacity-30 group-hover:opacity-100"><ArrowUpIcon /></span>
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr key={index} className="bg-brand-surface border-b border-slate-700 hover:bg-slate-800/50">
                {headers.map((header) => (
                  <td key={header} className="px-6 py-4 text-brand-text-primary whitespace-nowrap">
                    {String(row[header] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;

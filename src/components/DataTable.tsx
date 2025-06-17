
import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface DataTableProps {
  columns: string[];
  data: (string | number)[][];
  frozenColumns?: number;
}

type SortDirection = 'asc' | 'desc' | null;

export const DataTable: React.FC<DataTableProps> = ({ 
  columns, 
  data, 
  frozenColumns = 0 
}) => {
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const sortedData = useMemo(() => {
    if (sortColumn === null || sortDirection === null) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      // Handle numeric sorting
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle string sorting
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      
      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [data, sortColumn, sortDirection]);

  const handleSort = (columnIndex: number) => {
    if (sortColumn === columnIndex) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn(null);
      }
    } else {
      setSortColumn(columnIndex);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (columnIndex: number) => {
    if (sortColumn !== columnIndex) {
      return <ArrowUpDown className="h-3 w-3 opacity-50" />;
    }
    
    if (sortDirection === 'asc') {
      return <ArrowUp className="h-3 w-3" />;
    } else if (sortDirection === 'desc') {
      return <ArrowDown className="h-3 w-3" />;
    }
    
    return <ArrowUpDown className="h-3 w-3 opacity-50" />;
  };

  const frozenCols = columns.slice(0, frozenColumns);
  const scrollableCols = columns.slice(frozenColumns);

  return (
    <Card className="w-full">
      <div className="relative overflow-hidden">
        <div className="flex">
          {/* Frozen columns */}
          {frozenColumns > 0 && (
            <div className="bg-muted/50 border-r border-border">
              <div className="overflow-hidden">
                {/* Frozen header */}
                <div className="bg-muted border-b border-border">
                  {frozenCols.map((column, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 text-sm font-medium text-left border-r border-border last:border-r-0 min-w-[120px]"
                    >
                      <Button
                        variant="ghost"
                        className="h-auto p-0 font-medium justify-start"
                        onClick={() => handleSort(index)}
                      >
                        {column}
                        {getSortIcon(index)}
                      </Button>
                    </div>
                  ))}
                </div>
                
                {/* Frozen body */}
                <div className="max-h-96 overflow-y-auto">
                  {sortedData.map((row, rowIndex) => (
                    <div key={rowIndex} className="border-b border-border last:border-b-0">
                      {row.slice(0, frozenColumns).map((cell, cellIndex) => (
                        <div
                          key={cellIndex}
                          className="px-4 py-3 text-sm border-r border-border last:border-r-0 min-w-[120px]"
                        >
                          {typeof cell === 'number' ? cell.toFixed(2) : cell}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Scrollable columns */}
          <div className="flex-1 overflow-x-auto">
            {/* Scrollable header */}
            <div className="bg-muted border-b border-border flex">
              {scrollableCols.map((column, index) => (
                <div
                  key={index + frozenColumns}
                  className="px-4 py-3 text-sm font-medium text-left border-r border-border last:border-r-0 min-w-[120px] whitespace-nowrap"
                >
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-medium justify-start"
                    onClick={() => handleSort(index + frozenColumns)}
                  >
                    {column}
                    {getSortIcon(index + frozenColumns)}
                  </Button>
                </div>
              ))}
            </div>
            
            {/* Scrollable body */}
            <div className="max-h-96 overflow-y-auto">
              {sortedData.map((row, rowIndex) => (
                <div key={rowIndex} className="border-b border-border last:border-b-0 flex">
                  {row.slice(frozenColumns).map((cell, cellIndex) => (
                    <div
                      key={cellIndex + frozenColumns}
                      className="px-4 py-3 text-sm border-r border-border last:border-r-0 min-w-[120px] whitespace-nowrap"
                    >
                      {typeof cell === 'number' ? cell.toFixed(2) : cell}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

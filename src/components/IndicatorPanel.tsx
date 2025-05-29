
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IndicatorPanelProps {
  indicators: any[];
  selectedIndicator: string;
  onIndicatorSelect: (id: string) => void;
  selectedRegion: any;
  className?: string;
  vertical?: boolean;
}

export const IndicatorPanel: React.FC<IndicatorPanelProps> = ({ 
  indicators, 
  selectedIndicator, 
  onIndicatorSelect, 
  selectedRegion,
  className,
  vertical = false
}) => {
  return (
    <div className={cn("bg-white border border-gray-200 p-4 w-full", className)}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Key Indicators</h2>
        <p className="text-sm text-gray-600">
          {selectedRegion ? `Data for ${selectedRegion.name}` : 'National Overview'}
        </p>
      </div>

      {/* Indicators Layout - Optimized for bottom layout */}
      <div className="grid grid-cols-3 gap-3 w-full">
        {indicators.map((indicator) => (
          <Card
            key={indicator.id}
            className={cn(
              "p-3 cursor-pointer transition-all duration-200 hover:shadow-md w-full",
              selectedIndicator === indicator.id 
                ? "ring-2 ring-blue-500 bg-blue-50" 
                : "hover:bg-gray-50"
            )}
            onClick={() => onIndicatorSelect(indicator.id)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className={cn("w-3 h-3 rounded-full", indicator.color)}></div>
              <BarChart3 className="w-4 h-4 text-gray-400" />
            </div>
            
            <div className="space-y-1">
              <h3 className="font-medium text-gray-900 text-xs leading-tight">
                {indicator.name}
              </h3>
              
              <div className="text-sm font-bold text-gray-900">
                {indicator.value}
              </div>
              
              <div className="flex items-center space-x-1">
                {indicator.trend.startsWith('+') ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs",
                    indicator.trend.startsWith('+') 
                      ? "text-green-600 border-green-200" 
                      : "text-red-600 border-red-200"
                  )}
                >
                  {indicator.trend}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

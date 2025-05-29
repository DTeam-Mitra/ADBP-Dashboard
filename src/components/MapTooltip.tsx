
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, BookOpen } from 'lucide-react';

export const MapTooltip = ({ data, selectedIndicator }) => {
  if (!data || !data.region) return null;

  const { x, y, region } = data;

  const getIndicatorValue = (indicator, region) => {
    const values = {
      population: region.population || '0',
      literacy: region.literacy || '0%',
      gdp: '6.8%',
      healthcare: '41.2',
      employment: '46.8%',
      infrastructure: '44.1'
    };
    return values[indicator] || 'N/A';
  };

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: x + 10,
        top: y - 10,
        transform: 'translate(0, -100%)'
      }}
    >
      <Card className="p-3 bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200 min-w-48">
        <div className="flex items-center space-x-2 mb-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-900">{region.name}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 capitalize">
              {selectedIndicator.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <Badge variant="outline" className="text-xs">
              {getIndicatorValue(selectedIndicator, region)}
            </Badge>
          </div>
          
          <div className="border-t border-gray-100 pt-2">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{region.population}</span>
              </div>
              <div className="flex items-center space-x-1">
                <BookOpen className="w-3 h-3" />
                <span>{region.literacy}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

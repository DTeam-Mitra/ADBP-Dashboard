
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, Heart, GraduationCap, Wheat, Building2, Users } from 'lucide-react';

interface IndicatorData {
  label: string;
  value: number;
  target?: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  category: 'health' | 'education' | 'agriculture' | 'infrastructure' | 'social';
}

interface IndicatorCardsProps {
  district: string;
  block: string;
  indicators: IndicatorData[];
}

const getCategoryIcon = (category: string) => {
  const icons = {
    health: Heart,
    education: GraduationCap,
    agriculture: Wheat,
    infrastructure: Building2,
    social: Users,
  };
  return icons[category] || Activity;
};

const getCategoryColor = (category: string) => {
  const colors = {
    health: 'text-red-600 bg-red-50 border-red-200',
    education: 'text-blue-600 bg-blue-50 border-blue-200',
    agriculture: 'text-green-600 bg-green-50 border-green-200',
    infrastructure: 'text-orange-600 bg-orange-50 border-orange-200',
    social: 'text-purple-600 bg-purple-50 border-purple-200',
  };
  return colors[category] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export const IndicatorCards: React.FC<IndicatorCardsProps> = ({ district, block, indicators }) => {
  return (
    <Card className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{district}</h3>
          <p className="text-sm text-muted-foreground">{block} Block</p>
        </div>
        <Badge variant="outline" className="text-xs">
          {indicators.length} Indicators
        </Badge>
      </div>

      {/* Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {indicators.map((indicator, index) => {
          const IconComponent = getCategoryIcon(indicator.category);
          const colorClass = getCategoryColor(indicator.category);
          const progress = indicator.target ? (indicator.value / indicator.target) * 100 : indicator.value;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded ${colorClass}`}>
                  <IconComponent className="h-3 w-3" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {indicator.label}
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">
                    {indicator.value}{indicator.unit}
                  </span>
                  <div className="flex items-center gap-1">
                    {indicator.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-600" />}
                    {indicator.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-600" />}
                    {indicator.target && (
                      <span className="text-xs text-muted-foreground">
                        / {indicator.target}{indicator.unit}
                      </span>
                    )}
                  </div>
                </div>
                
                <Progress 
                  value={Math.min(progress, 100)} 
                  className="h-2"
                />
                
                <div className="text-xs text-muted-foreground text-right">
                  {progress.toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

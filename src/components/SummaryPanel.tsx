
import React, { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TrendingUp, MapPin, Users, BookOpen, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SummaryPanelProps {
  selectedIndicator: string;
  selectedRegion: any;
  currentLevel: string;
  onScroll: (scrolled: boolean) => void;
  onFocus?: (focused: boolean) => void;
  className?: string;
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({ 
  selectedIndicator, 
  selectedRegion, 
  currentLevel, 
  onScroll,
  onFocus,
  className 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = event.currentTarget.scrollTop;
    const isScrolled = scrollTop > 50;
    onScroll(isScrolled);
    
    // Call onFocus when user actively scrolls
    if (onFocus && isScrolled) {
      onFocus(true);
    }
  };

  const handleMouseEnter = () => {
    if (onFocus) onFocus(true);
  };

  const handleMouseLeave = () => {
    if (onFocus) onFocus(false);
  };

  const getIndicatorIcon = (indicator: string) => {
    const icons: Record<string, any> = {
      population: Users,
      literacy: BookOpen,
      gdp: TrendingUp,
      healthcare: Building2,
      employment: Building2,
      infrastructure: Building2
    };
    return icons[indicator] || TrendingUp;
  };

  const getIndicatorColor = (indicator: string) => {
    const colors: Record<string, string> = {
      population: 'text-blue-600',
      literacy: 'text-green-600',
      gdp: 'text-purple-600',
      healthcare: 'text-red-600',
      employment: 'text-orange-600',
      infrastructure: 'text-indigo-600'
    };
    return colors[indicator] || 'text-blue-600';
  };

  const summaryData: Record<string, any> = {
    population: {
      title: 'Population Analytics',
      description: 'Demographic insights and population distribution across regions',
      metrics: [
        { label: 'Total Population', value: '1.38 Billion', change: '+1.2%' },
        { label: 'Growth Rate', value: '1.02%', change: '-0.1%' },
        { label: 'Density', value: '464/km²', change: '+1.1%' },
        { label: 'Urban Population', value: '34.9%', change: '+2.3%' }
      ],
      insights: [
        'Maharashtra leads with highest population at 112M',
        'Urban migration increasing at 2.3% annually',
        'Rural-urban balance shifting towards cities',
        'Youth demographic (15-35) represents 35% of population'
      ]
    },
    literacy: {
      title: 'Education & Literacy',
      description: 'Educational achievements and literacy rates across demographics',
      metrics: [
        { label: 'National Literacy', value: '77.7%', change: '+2.1%' },
        { label: 'Male Literacy', value: '84.7%', change: '+1.8%' },
        { label: 'Female Literacy', value: '70.3%', change: '+2.6%' },
        { label: 'Digital Literacy', value: '38.0%', change: '+8.2%' }
      ],
      insights: [
        'Kerala maintains highest literacy at 94%',
        'Gender gap reducing by 0.8% annually',
        'Digital literacy growing rapidly in urban areas',
        'Government schemes showing positive impact'
      ]
    }
  };

  const currentData = summaryData[selectedIndicator] || summaryData.population;
  const IconComponent = getIndicatorIcon(selectedIndicator);
  const iconColor = getIndicatorColor(selectedIndicator);

  return (
    <div 
      className={cn("bg-white border-r border-gray-200 flex flex-col relative shadow-lg", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-white relative z-10">
        <div className="flex items-center space-x-3 mb-3">
          <div className={cn("p-2 rounded-lg bg-gray-50")}>
            <IconComponent className={cn("w-5 h-5", iconColor)} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{currentData.title}</h2>
            <p className="text-xs text-gray-500">{currentData.description}</p>
          </div>
        </div>
        
        {selectedRegion && (
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{selectedRegion.name}</span>
            <Badge variant="outline" className="text-xs">
              {currentLevel}
            </Badge>
          </div>
        )}
      </div>

      {/* Scrollable Content */}
      <ScrollArea 
        className="flex-1"
        onScrollCapture={handleScroll}
      >
        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Key Metrics</h3>
            <div className="space-y-3">
              {currentData.metrics.map((metric: any, index: number) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-600">{metric.label}</span>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs",
                        metric.change.startsWith('+') 
                          ? "text-green-600 border-green-200" 
                          : "text-red-600 border-red-200"
                      )}
                    >
                      {metric.change}
                    </Badge>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {metric.value}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Key Insights</h3>
            <div className="space-y-3">
              {currentData.insights.map((insight: string, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700 leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Trends */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Recent Trends</h3>
            <div className="space-y-2">
              {['2024', '2023', '2022', '2021'].map((year, index) => (
                <div key={year} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-sm text-gray-600">{year}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {index === 0 ? '77.7%' : `${(77.7 - (index * 0.8)).toFixed(1)}%`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

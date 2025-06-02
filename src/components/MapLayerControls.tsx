
import React from 'react';
import { Button } from '@/components/ui/button';
import { Map, Layers, Layers2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MapLayerControlsProps {
  activeLayer: string;
  onLayerChange: (layer: string) => void;
}

export const MapLayerControls: React.FC<MapLayerControlsProps> = ({
  activeLayer,
  onLayerChange
}) => {
  const layerControls = [
    {
      id: 'default',
      icon: Map,
      tooltip: 'Default View',
      color: 'bg-blue-500'
    },
    {
      id: 'satellite',
      icon: Layers,
      tooltip: 'Satellite View',
      color: 'bg-green-500'
    },
    {
      id: 'terrain',
      icon: Layers2,
      tooltip: 'Terrain View',
      color: 'bg-orange-500'
    }
  ];

  // Generate additional layer controls to fill the space
  const additionalControls = Array.from({ length: 12 }, (_, i) => ({
    id: `layer-${i + 4}`,
    icon: Layers,
    tooltip: `Layer ${i + 4}`,
    color: `bg-gray-${400 + (i % 3) * 100}`
  }));

  const allControls = [...layerControls, ...additionalControls];

  return (
    <div className="h-full flex flex-col items-center py-4 space-y-2">
      {allControls.map((control) => {
        const IconComponent = control.icon;
        const isActive = activeLayer === control.id;
        
        return (
          <Button
            key={control.id}
            variant="ghost"
            size="icon"
            className={cn(
              "w-10 h-10 relative group",
              isActive 
                ? "bg-blue-100 text-blue-600 border border-blue-300" 
                : "hover:bg-gray-100 text-gray-600"
            )}
            onClick={() => onLayerChange(control.id)}
            title={control.tooltip}
          >
            <IconComponent className="w-4 h-4" />
            
            {/* Active indicator dot */}
            {isActive && (
              <div className="absolute -right-1 -top-1 w-2 h-2 bg-blue-500 rounded-full" />
            )}
            
            {/* Tooltip on hover */}
            <div className="absolute right-full mr-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              {control.tooltip}
            </div>
          </Button>
        );
      })}
    </div>
  );
};

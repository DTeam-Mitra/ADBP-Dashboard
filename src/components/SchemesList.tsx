
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Scheme {
  id: string;
  name: string;
  achievement: string;
  targetAchievement: string;
}

interface SchemesListProps {
  schemes: Scheme[];
  selectedScheme: string;
  onSchemeSelect: (schemeId: string) => void;
}

export const SchemesList: React.FC<SchemesListProps> = ({
  schemes,
  selectedScheme,
  onSchemeSelect
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Schemes</h2>
      
      <div className="grid grid-cols-4 gap-4">
        {schemes.map((scheme) => (
          <Card
            key={scheme.id}
            className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedScheme === scheme.id 
                ? "ring-2 ring-blue-500 bg-blue-50" 
                : "hover:bg-gray-50"
            }`}
            onClick={() => onSchemeSelect(scheme.id)}
          >
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 text-sm leading-tight">
                {scheme.name}
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Target Achievement</span>
                  <Badge variant="outline" className="text-xs">
                    {scheme.targetAchievement}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Current Achievement</span>
                  <Badge 
                    variant="outline" 
                    className="text-xs text-green-600 border-green-200"
                  >
                    {scheme.achievement}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

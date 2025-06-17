import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrendingUp, TrendingDown, Search, Filter } from 'lucide-react';
import { IndicatorCards } from './IndicatorCards';
import { parseCSVData, CSVData } from '@/utils/csvParser';

interface ThemeData {
  id: string;
  name: string;
  icon: string;
  color: string;
  bestDistrict: string;
  worstDistrict: string;
  bestScore: number;
  worstScore: number;
}

interface EnhancedDashboardThemesProps {
  onThemeSelect?: (theme: string) => void;
}

export const EnhancedDashboardThemes: React.FC<EnhancedDashboardThemesProps> = ({ onThemeSelect }) => {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [csvData, setCSVData] = useState<CSVData[]>([]);
  const [themes, setThemes] = useState<ThemeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<CSVData[]>([]);

  useEffect(() => {
    loadCSVData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = csvData.filter(row => 
        row.districtName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.blockName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(csvData);
    }
  }, [searchTerm, csvData]);

  const loadCSVData = async () => {
    try {
      const response = await fetch('/src/database/Dashboard Data.csv');
      const csvText = await response.text();
      const parsedData = parseCSVData(csvText);
      setCSVData(parsedData);
      processThemes(parsedData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading CSV data:', error);
      setLoading(false);
    }
  };

  const processThemes = (data: CSVData[]) => {
    const districtData = data.reduce((acc, row) => {
      if (!acc[row.districtName]) {
        acc[row.districtName] = {
          health: [],
          nutrition: [],
          basicInfra: [],
          socialDevelopment: [],
          education: [],
          agriculture: []
        };
      }
      
      acc[row.districtName].health.push(row.health.compositeScore);
      acc[row.districtName].nutrition.push(row.nutrition.compositeScore);
      acc[row.districtName].basicInfra.push(row.basicInfra.compositeScore);
      acc[row.districtName].socialDevelopment.push(row.socialInfra.compositeScore);
      acc[row.districtName].education.push(row.education.compositeScore);
      acc[row.districtName].agriculture.push(row.agriculture.compositeScore);
      
      return acc;
    }, {} as Record<string, any>);

    const calculateBestWorst = (category: string) => {
      const districtScores = Object.entries(districtData).map(([district, scores]) => {
        const categoryScores = scores[category];
        const average = categoryScores.reduce((sum: number, score: number) => sum + score, 0) / categoryScores.length;
        return { district, score: average };
      }).filter(item => item.score > 0);

      districtScores.sort((a, b) => b.score - a.score);
      
      return {
        best: districtScores[0] || { district: 'N/A', score: 0 },
        worst: districtScores[districtScores.length - 1] || { district: 'N/A', score: 0 }
      };
    };

    const healthData = calculateBestWorst('health');
    const nutritionData = calculateBestWorst('nutrition');
    const infraData = calculateBestWorst('basicInfra');
    const socialData = calculateBestWorst('socialDevelopment');
    const educationData = calculateBestWorst('education');
    const agricultureData = calculateBestWorst('agriculture');

    const themesList: ThemeData[] = [
      {
        id: 'health-nutrition',
        name: 'Health & Nutrition',
        icon: '🏥',
        color: 'bg-red-500',
        bestDistrict: healthData.best.district,
        worstDistrict: healthData.worst.district,
        bestScore: healthData.best.score,
        worstScore: healthData.worst.score,
      },
      {
        id: 'education',
        name: 'Education',
        icon: '📚',
        color: 'bg-blue-500',
        bestDistrict: educationData.best.district,
        worstDistrict: educationData.worst.district,
        bestScore: educationData.best.score,
        worstScore: educationData.worst.score,
      },
      {
        id: 'agriculture',
        name: 'Agriculture & Allied',
        icon: '🌾',
        color: 'bg-green-500',
        bestDistrict: agricultureData.best.district,
        worstDistrict: agricultureData.worst.district,
        bestScore: agricultureData.best.score,
        worstScore: agricultureData.worst.score,
      },
      {
        id: 'infrastructure',
        name: 'Basic Infrastructure',
        icon: '🏗️',
        color: 'bg-orange-500',
        bestDistrict: infraData.best.district,
        worstDistrict: infraData.worst.district,
        bestScore: infraData.best.score,
        worstScore: infraData.worst.score,
      },
      {
        id: 'social',
        name: 'Social Development',
        icon: '👥',
        color: 'bg-purple-500',
        bestDistrict: socialData.best.district,
        worstDistrict: socialData.worst.district,
        bestScore: socialData.best.score,
        worstScore: socialData.worst.score,
      },
    ];

    setThemes(themesList);
  };

  const handleThemeClick = (themeId: string) => {
    setSelectedTheme(themeId);
    onThemeSelect?.(themeId);
  };

  const handleBackToThemes = () => {
    setSelectedTheme(null);
  };

  const getIndicatorsForTheme = (row: CSVData, themeId: string) => {
    switch (themeId) {
      case 'health-nutrition':
        return [
          { label: 'ANC Registration', value: row.health.ancRegistration, unit: '%', trend: 'up' as const, category: 'health' as const },
          { label: 'Institutional Deliveries', value: row.health.institutionalDeliveries, unit: '%', trend: 'up' as const, category: 'health' as const },
          { label: 'Low Birth Weight', value: row.health.lowBirthWeight, unit: '%', trend: 'down' as const, category: 'health' as const },
          { label: 'NQAS Certified', value: row.health.nqasCertified, unit: '%', trend: 'up' as const, category: 'health' as const },
        ];
      case 'education':
        return [
          { label: 'Boys Transition Rate', value: row.education.boysTransitionUS, unit: '%', trend: 'up' as const, category: 'education' as const },
          { label: 'Girls Transition Rate', value: row.education.girlsTransitionUS, unit: '%', trend: 'up' as const, category: 'education' as const },
          { label: 'PTR Schools', value: row.education.ptrSchools, unit: '%', trend: 'up' as const, category: 'education' as const },
          { label: 'Girls Toilets', value: row.education.girlsToilets, unit: '%', trend: 'up' as const, category: 'education' as const },
        ];
      case 'agriculture':
        return [
          { label: 'FPO Formed', value: row.agriculture.fpoFormed, unit: '%', trend: 'up' as const, category: 'agriculture' as const },
          { label: 'Soil Health Cards', value: row.agriculture.soilHealthCards, unit: '%', trend: 'up' as const, category: 'agriculture' as const },
          { label: 'PM Kisan Beneficiaries', value: row.agriculture.pmKisanBeneficiaries, unit: '%', trend: 'up' as const, category: 'agriculture' as const },
          { label: 'Animal Vaccination', value: row.agriculture.animalVaccination, unit: '%', trend: 'up' as const, category: 'agriculture' as const },
        ];
      case 'infrastructure':
        return [
          { label: 'Tap Water Connections', value: row.basicInfra.tapWaterConnections, unit: '%', trend: 'up' as const, category: 'infrastructure' as const },
          { label: 'ODF Plus', value: row.basicInfra.odfPlus, unit: '%', trend: 'up' as const, category: 'infrastructure' as const },
          { label: 'BharatNet', value: row.basicInfra.bharatNet, unit: '%', trend: 'up' as const, category: 'infrastructure' as const },
          { label: 'Live BharatNet', value: row.basicInfra.liveBharatNet, unit: '%', trend: 'up' as const, category: 'infrastructure' as const },
        ];
      case 'social':
        return [
          { label: 'SHG Households', value: row.socialInfra.shgHouseholds, unit: '%', trend: 'up' as const, category: 'social' as const },
          { label: 'Revolving Fund', value: row.socialInfra.revolvingFund, unit: '%', trend: 'up' as const, category: 'social' as const },
          { label: 'Banking Touch Points', value: row.socialInfra.bankingTouchPoints, unit: '%', trend: 'up' as const, category: 'social' as const },
          { label: 'Digital Certification', value: row.socialInfra.digitalCertification, unit: '%', trend: 'up' as const, category: 'social' as const },
        ];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading development insights...</div>
      </div>
    );
  }

  if (selectedTheme) {
    const themeName = themes.find(t => t.id === selectedTheme)?.name || 'Theme';
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{themeName} - Detailed Data</h2>
          <Button variant="outline" onClick={handleBackToThemes}>
            ← Back to Themes
          </Button>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search districts or blocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Cards Grid */}
        <div className="space-y-4">
          {filteredData.map((row, index) => (
            <IndicatorCards
              key={index}
              district={row.districtName}
              block={row.blockName}
              indicators={getIndicatorsForTheme(row, selectedTheme)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Development Themes</h2>
        <p className="text-muted-foreground">Key development indicators across Maharashtra</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <Card 
            key={theme.id} 
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary"
            onClick={() => handleThemeClick(theme.id)}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-lg ${theme.color} flex items-center justify-center text-white text-xl`}>
                {theme.icon}
              </div>
              <h3 className="text-lg font-semibold">{theme.name}</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Best Performing</span>
                <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {theme.bestDistrict}
                </Badge>
              </div>
              <div className="text-sm text-right text-green-600 font-medium">
                Score: {theme.bestScore.toFixed(1)}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Needs Improvement</span>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  {theme.worstDistrict}
                </Badge>
              </div>
              <div className="text-sm text-right text-orange-600 font-medium">
                Score: {theme.worstScore.toFixed(1)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

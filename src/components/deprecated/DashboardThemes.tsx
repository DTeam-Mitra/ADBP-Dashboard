
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { DataTable } from '../DataTable';
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

interface DashboardThemesProps {
  onThemeSelect?: (theme: string) => void;
}

export const DashboardThemes: React.FC<DashboardThemesProps> = ({ onThemeSelect }) => {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [csvData, setCSVData] = useState<CSVData[]>([]);
  const [themes, setThemes] = useState<ThemeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCSVData();
  }, []);

  const loadCSVData = async () => {
    try {
      const response = await fetch('/src/database/Mar2024.csv');
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
    // Group by district and calculate averages
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

    // Calculate averages and find best/worst
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

  const getTableData = (themeId: string) => {
    const columns = ['District', 'Block'];
    let dataColumns: string[] = [];

    switch (themeId) {
      case 'health-nutrition':
        dataColumns = [
          'ANC Registration (%)',
          'Institutional Deliveries (%)',
          'Low Birth Weight (%)',
          'NQAS Certified (%)',
          'Health Composite Score'
        ];
        break;
      case 'education':
        dataColumns = [
          'Boys Transition Rate (%)',
          'Girls Transition Rate (%)',
          'PTR Schools (%)',
          'Girls Toilets (%)',
          'Education Composite Score'
        ];
        break;
      case 'agriculture':
        dataColumns = [
          'FPO Formed (%)',
          'Soil Health Cards (%)',
          'PM Kisan Beneficiaries (%)',
          'Animal Vaccination (%)',
          'Agriculture Composite Score'
        ];
        break;
      case 'infrastructure':
        dataColumns = [
          'Tap Water Connections (%)',
          'ODF Plus (%)',
          'BharatNet (%)',
          'Live BharatNet (%)',
          'Infrastructure Composite Score'
        ];
        break;
      case 'social':
        dataColumns = [
          'SHG Households (%)',
          'Revolving Fund (%)',
          'Banking Touch Points (%)',
          'Digital Certification (%)',
          'Social Composite Score'
        ];
        break;
      default:
        dataColumns = [];
    }

    const allColumns = [...columns, ...dataColumns];

    const tableData = csvData.map(row => {
      const baseData = [row.districtName, row.blockName];
      
      let themeData: (string | number)[] = [];
      switch (themeId) {
        case 'health-nutrition':
          themeData = [
            row.health.ancRegistration,
            row.health.institutionalDeliveries,
            row.health.lowBirthWeight,
            row.health.nqasCertified,
            row.health.compositeScore
          ];
          break;
        case 'education':
          themeData = [
            row.education.boysTransitionUS,
            row.education.girlsTransitionUS,
            row.education.ptrSchools,
            row.education.girlsToilets,
            row.education.compositeScore
          ];
          break;
        case 'agriculture':
          themeData = [
            row.agriculture.fpoFormed,
            row.agriculture.soilHealthCards,
            row.agriculture.pmKisanBeneficiaries,
            row.agriculture.animalVaccination,
            row.agriculture.compositeScore
          ];
          break;
        case 'infrastructure':
          themeData = [
            row.basicInfra.tapWaterConnections,
            row.basicInfra.odfPlus,
            row.basicInfra.bharatNet,
            row.basicInfra.liveBharatNet,
            row.basicInfra.compositeScore
          ];
          break;
        case 'social':
          themeData = [
            row.socialInfra.shgHouseholds,
            row.socialInfra.revolvingFund,
            row.socialInfra.bankingTouchPoints,
            row.socialInfra.digitalCertification,
            row.socialInfra.compositeScore
          ];
          break;
      }
      
      return [...baseData, ...themeData];
    });

    return { columns: allColumns, data: tableData };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading development insights...</div>
      </div>
    );
  }

  if (selectedTheme) {
    const tableConfig = getTableData(selectedTheme);
    const themeName = themes.find(t => t.id === selectedTheme)?.name || 'Theme';
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{themeName} - Detailed Data</h2>
          <Button variant="outline" onClick={handleBackToThemes}>
            ← Back to Themes
          </Button>
        </div>
        <DataTable 
          columns={tableConfig.columns}
          data={tableConfig.data}
          frozenColumns={2}
        />
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
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {theme.bestDistrict}
                </Badge>
              </div>
              <div className="text-sm text-right text-green-600 font-medium">
                Score: {theme.bestScore.toFixed(1)}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Needs Improvement</span>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
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

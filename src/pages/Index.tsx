
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { InteractiveMap } from '@/components/InteractiveMap';
import { IndicatorPanel } from '@/components/IndicatorPanel';
import { SummaryPanel } from '@/components/SummaryPanel';
import { MapTooltip } from '@/components/MapTooltip';

const Index = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [selectedIndicator, setSelectedIndicator] = useState('population');
  const [currentLevel, setCurrentLevel] = useState('country');
  const [tooltipData, setTooltipData] = useState(null);
  const [activeTab, setActiveTab] = useState('charts');

  // Sample data for different regions and indicators
  const indicators = [
    { id: 'population', name: 'Pradhan Mantri Kisan Samman Nidhi', value: '98%', color: 'bg-blue-500', trend: '+1.2%', achievement: '98%' },
    { id: 'literacy', name: 'Pradhan Mantri Jan Arogya Yojana', value: '98%', color: 'bg-green-500', trend: '+2.1%', achievement: '98%' },
    { id: 'gdp', name: 'Mahila Samriddhi Yojana', value: '98%', color: 'bg-purple-500', trend: '+0.5%', achievement: '98%' },
    { id: 'healthcare', name: 'Mukhyamantri Yuva Karya Prashikshan Yojana', value: '98%', color: 'bg-red-500', trend: '+3.2%', achievement: '98%' }
  ];

  const handleRegionClick = (region: any) => {
    setSelectedRegion(region);
    if (currentLevel === 'country') {
      setCurrentLevel('state');
    } else if (currentLevel === 'state') {
      setCurrentLevel('district');
    } else if (currentLevel === 'district') {
      setCurrentLevel('block');
    }
  };

  const handleRegionHover = (region: any, event?: any) => {
    setHoveredRegion(region);
    if (region && event) {
      setTooltipData({
        x: event.clientX,
        y: event.clientY,
        region: region
      });
    } else {
      setTooltipData(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Fixed Navbar at top */}
      <Navbar />
      
      {/* Main Layout */}
      <div className="pt-16 h-screen flex flex-col">
        
        {/* Tabs Section */}
        <div className="px-4 py-2 bg-white border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="h-10">
              <TabsTrigger value="charts" className="px-6">Charts</TabsTrigger>
              <TabsTrigger value="summary" className="px-6">Summary</TabsTrigger>
            </TabsList>
            
            {/* Tab Content Area */}
            <div className="mt-4">
              <TabsContent value="charts" className="h-[60vh] m-0">
                <div className="grid grid-cols-12 h-full gap-4">
                  {/* Left Chat Area */}
                  <div className="col-span-3 flex flex-col">
                    <div className="flex-1 bg-white rounded-lg border p-4 mb-4">
                      {/* Map content or other chart content */}
                      <InteractiveMap
                        currentLevel={currentLevel}
                        selectedRegion={selectedRegion}
                        hoveredRegion={hoveredRegion}
                        selectedIndicator={selectedIndicator}
                        onRegionClick={handleRegionClick}
                        onRegionHover={handleRegionHover}
                        className="w-full h-full"
                      />
                    </div>
                    
                    {/* Chat Interface */}
                    <Card className="p-4 h-20">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="text" 
                          placeholder="Chat with me Here"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Button size="sm" className="px-3">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  </div>
                  
                  {/* Main Map Area */}
                  <div className="col-span-9 bg-white rounded-lg border relative">
                    <InteractiveMap
                      currentLevel={currentLevel}
                      selectedRegion={selectedRegion}
                      hoveredRegion={hoveredRegion}
                      selectedIndicator={selectedIndicator}
                      onRegionClick={handleRegionClick}
                      onRegionHover={handleRegionHover}
                      className="w-full h-full"
                    />
                    
                    {/* Map Overlay Info */}
                    <div className="absolute top-4 right-4 z-30">
                      <Card className="p-3 bg-white/90 backdrop-blur-sm">
                        <div className="text-sm font-medium text-gray-700">
                          Current View: {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)}
                        </div>
                        {selectedRegion && (
                          <div className="text-xs text-gray-500 mt-1">
                            {selectedRegion.name}
                          </div>
                        )}
                      </Card>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="summary" className="h-[60vh] m-0">
                <SummaryPanel 
                  selectedIndicator={selectedIndicator}
                  selectedRegion={selectedRegion}
                  currentLevel={currentLevel}
                  onScroll={() => {}}
                  onFocus={() => {}}
                  className="h-full"
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Bottom Schemes Section */}
        <div className="flex-1 bg-white border-t p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Schemes</h2>
          <div className="grid grid-cols-4 gap-4">
            {indicators.map((scheme) => (
              <Card
                key={scheme.id}
                className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedIndicator === scheme.id 
                    ? "ring-2 ring-blue-500 bg-blue-50" 
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedIndicator(scheme.id)}
              >
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 text-sm leading-tight">
                    {scheme.name}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Target Achievement</span>
                    <Badge variant="outline" className="text-xs">
                      {scheme.achievement}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Map Tooltip */}
      {tooltipData && (
        <MapTooltip
          data={tooltipData}
          selectedIndicator={selectedIndicator}
        />
      )}
    </div>
  );
};

export default Index;

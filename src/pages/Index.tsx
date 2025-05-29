
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  const [summaryScrolled, setSummaryScrolled] = useState(false);
  const [summaryFocused, setSummaryFocused] = useState(false);
  const [tooltipData, setTooltipData] = useState(null);

  // Sample data for different regions and indicators
  const indicators = [
    { id: 'population', name: 'Population', value: '1.38B', color: 'bg-blue-500', trend: '+1.2%' },
    { id: 'literacy', name: 'Literacy Rate', value: '77.7%', color: 'bg-green-500', trend: '+2.1%' },
    { id: 'gdp', name: 'GDP Growth', value: '6.8%', color: 'bg-purple-500', trend: '+0.5%' },
    { id: 'healthcare', name: 'Healthcare Index', value: '41.2', color: 'bg-red-500', trend: '+3.2%' },
    { id: 'employment', name: 'Employment Rate', value: '46.8%', color: 'bg-orange-500', trend: '-0.8%' },
    { id: 'infrastructure', name: 'Infrastructure Score', value: '44.1', color: 'bg-indigo-500', trend: '+4.1%' }
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

  const handleSummaryScroll = (scrolled: boolean) => {
    setSummaryScrolled(scrolled);
  };

  const handleSummaryFocus = (focused: boolean) => {
    setSummaryFocused(focused);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Fixed Navbar at top */}
      <Navbar />
      
      {/* Main Layout Grid */}
      <div className="grid grid-cols-12 grid-rows-12 h-screen pt-16 gap-2 p-2">
        
        {/* Left Side - Indicators Panel (Vertical) */}
        <div className="col-span-2 row-span-12 relative z-10">
          <IndicatorPanel
            indicators={indicators}
            selectedIndicator={selectedIndicator}
            onIndicatorSelect={setSelectedIndicator}
            selectedRegion={selectedRegion}
            className="h-full w-full flex flex-col"
            vertical={true}
          />
        </div>

        {/* Top Right - Summary Panel */}
        <div className={`col-span-10 row-span-4 relative transition-all duration-300 ${summaryScrolled || summaryFocused ? 'z-40' : 'z-20'}`}>
          <SummaryPanel 
            selectedIndicator={selectedIndicator}
            selectedRegion={selectedRegion}
            currentLevel={currentLevel}
            onScroll={handleSummaryScroll}
            onFocus={handleSummaryFocus}
            className="h-full"
          />
        </div>

        {/* Main Center - Map */}
        <div className={`col-span-7 row-span-8 relative transition-all duration-300 z-20 ${summaryScrolled && !summaryFocused ? 'blur-sm' : ''}`}>
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

        {/* Bottom Right - NavBar/Control Panel */}
        <div className="col-span-3 row-span-8 relative z-10">
          <Card className="h-full p-4 bg-white">
            <h3 className="font-semibold text-gray-900 mb-4">Navigation Controls</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-1">Current Level</div>
                <Badge variant="outline">{currentLevel}</Badge>
              </div>
              
              {selectedRegion && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-1">Selected Region</div>
                  <div className="text-sm text-gray-600">{selectedRegion.name}</div>
                </div>
              )}
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-1">Selected Indicator</div>
                <div className="text-sm text-gray-600">
                  {indicators.find(i => i.id === selectedIndicator)?.name}
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <div className="text-xs text-gray-500 font-medium">Instructions:</div>
                <div className="text-xs text-gray-600">• Click on map markers to drill down</div>
                <div className="text-xs text-gray-600">• Hover for quick stats</div>
                <div className="text-xs text-gray-600">• Select indicators from left panel</div>
              </div>
            </div>
          </Card>
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

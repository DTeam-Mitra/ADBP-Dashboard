
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { InteractiveMap } from '@/components/InteractiveMap';
import { SummaryPanel } from '@/components/SummaryPanel';
import { MapTooltip } from '@/components/MapTooltip';
import { ChatInterface } from '@/components/ChatInterface';
import { SchemesList } from '@/components/SchemesList';
import { MapLayerControls } from '@/components/MapLayerControls';

const Index = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [selectedIndicator, setSelectedIndicator] = useState('population');
  const [currentLevel, setCurrentLevel] = useState('country');
  const [tooltipData, setTooltipData] = useState(null);
  const [activeTab, setActiveTab] = useState('map');
  const [activeMapLayer, setActiveMapLayer] = useState('default');

  // Sample data for schemes
  const schemes = [
    { 
      id: 'pm-kisan', 
      name: 'Pradhan Mantri Kisan Samman Nidhi', 
      achievement: '98%',
      targetAchievement: '98%'
    },
    { 
      id: 'pm-jan-arogya', 
      name: 'Pradhan Mantri Jan Arogya Yojana', 
      achievement: '98%',
      targetAchievement: '98%'
    },
    { 
      id: 'mahila-samriddhi', 
      name: 'Mahila Samriddhi Yojana', 
      achievement: '98%',
      targetAchievement: '98%'
    },
    { 
      id: 'yuva-karya', 
      name: 'Mukhyamantri Yuva Karya Prashikshan Yojana', 
      achievement: '98%',
      targetAchievement: '98%'
    }
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
      {/* Fixed Navbar */}
      <Navbar />
      
      {/* Main Layout with Sidebar */}
      <div className="pt-16 h-screen flex">
        
        {/* Left Sidebar - Permanent Chatbot */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">MITRA Assistant</h3>
            <p className="text-sm text-gray-600">Ask me about the dashboard data</p>
          </div>
          <div className="flex-1">
            <ChatInterface />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          
          {/* Top Tabs Section */}
          <div className="px-6 py-3 bg-white border-b">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-center">
                <TabsList className="h-10 bg-gray-100">
                  <TabsTrigger value="summary" className="px-8 py-2">Summary</TabsTrigger>
                  <TabsTrigger value="map" className="px-8 py-2">Map</TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </div>

          {/* Content Area with Right Controls */}
          <div className="flex-1 flex">
            
            {/* Main Content */}
            <div className="flex-1 relative">
              {activeTab === 'map' && (
                <div className="absolute inset-0 p-4">
                  <div className="h-full relative">
                    {/* Main Map Area */}
                    <div className="h-full bg-white rounded-lg border relative">
                      <InteractiveMap
                        currentLevel={currentLevel}
                        selectedRegion={selectedRegion}
                        hoveredRegion={hoveredRegion}
                        selectedIndicator={selectedIndicator}
                        onRegionClick={handleRegionClick}
                        onRegionHover={handleRegionHover}
                        activeLayer={activeMapLayer}
                        className="w-full h-full"
                      />
                      
                      {/* Map Overlay Info */}
                      <div className="absolute top-4 left-4 z-30">
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
                </div>
              )}

              {activeTab === 'summary' && (
                <div className="absolute inset-0 p-4">
                  <SummaryPanel 
                    selectedIndicator={selectedIndicator}
                    selectedRegion={selectedRegion}
                    currentLevel={currentLevel}
                    onScroll={() => {}}
                    onFocus={() => {}}
                    className="h-full"
                  />
                </div>
              )}
            </div>

            {/* Right Sidebar - Map Layer Controls */}
            {activeTab === 'map' && (
              <div className="w-16 border-l border-gray-200 bg-white">
                <MapLayerControls 
                  activeLayer={activeMapLayer}
                  onLayerChange={setActiveMapLayer}
                />
              </div>
            )}
          </div>

          {/* Bottom Schemes Section */}
          <div className="bg-white border-t p-4">
            <SchemesList 
              schemes={schemes}
              selectedScheme={selectedIndicator}
              onSchemeSelect={setSelectedIndicator}
            />
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

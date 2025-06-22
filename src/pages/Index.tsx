
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { InteractiveMap } from '@/components/InteractiveMap';
import { MapTooltip } from '@/components/MapTooltip';
import { CollapsibleChatSidebar } from '@/components/CollapsibleChatSidebar';
import { SchemesList } from '@/components/SchemesList';
import { MapLayerControls } from '@/components/MapLayerControls';
import { EnhancedDashboardThemes } from '@/components/EnhancedDashboardThemes';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import 'leaflet/dist/leaflet.css';
import DashV4 from '@/components/DashboardVfour';
import DashV3 from '@/components/DashboardVthree';

const Index = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [selectedIndicator, setSelectedIndicator] = useState('population');
  const [currentLevel, setCurrentLevel] = useState('country');
  const [tooltipData, setTooltipData] = useState(null);
  const [activeTab, setActiveTab] = useState('insights');
  const [activeMapLayer, setActiveMapLayer] = useState('default');
  const { fontSize, isDarkMode } = useAccessibility();

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
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-background text-foreground relative overflow-hidden dashboard-layout`} style={{ fontSize: `${fontSize}rem` }}>
      {/* Fixed Navbar */}
      <Navbar />
      
      {/* Main Layout with Sidebar */}
      <div className="pt-16 h-screen flex main-content">
        
        {/* Left Sidebar - Collapsible Chatbot */}
        <CollapsibleChatSidebar />

        {/* Main Content Area - Dynamically Expand */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Tabs Section 
          <div className="px-6 py-3 bg-background border-b border-border">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-center">
                <TabsList className="h-10 bg-muted tabs-list">
                  <TabsTrigger value="insights" className="px-8 py-2">Development Insights</TabsTrigger>
                  <TabsTrigger value="map" className="px-8 py-2">Interactive Map</TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </div>

          {/* Content Area with Right Controls */}
          <div className="flex-1 flex min-h-0">
            
            {/* Main Content */}
            <div className="flex-1 relative min-w-0">
              {activeTab === 'map' && (
                <div className="absolute inset-0 p-4 tabs-content">
                  <div className="h-full relative map-area">
                    {/* Main Map Area */}
                    <div className="h-full bg-background rounded-lg border border-border relative">
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
                        <Card className="p-3 bg-background/90 backdrop-blur-sm border-border">
                          <div className="text-sm font-medium text-foreground">
                            Current View: {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)}
                          </div>
                          {selectedRegion && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {selectedRegion.name}
                            </div>
                          )}
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'insights' && (
                <div className="absolute inset-0 p-4 tabs-content">
                  <div className="h-full overflow-auto">
                    <DashV3/>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar - Map Layer Controls */}
            {activeTab === 'map' && (
              <div className="w-16 border-l border-border bg-background map-controls">
                <MapLayerControls 
                  activeLayer={activeMapLayer}
                  onLayerChange={setActiveMapLayer}
                />
              </div>
            )}
          </div>

          
        </div>
      </div>

      {/* Map Tooltip 
      {tooltipData && (
        <MapTooltip
          data={tooltipData}
          selectedIndicator={selectedIndicator}
        />
      )}*/}
    </div>
  );
};

export default Index;

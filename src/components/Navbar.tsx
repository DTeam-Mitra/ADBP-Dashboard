import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Minus, Plus, RotateCcw, Moon, Sun } from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export const Navbar = () => {
  const {
    fontSize,
    isDarkMode,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    toggleDarkMode,
  } = useAccessibility();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[hsl(var(--primary))] backdrop-blur-sm border-b border-border shadow">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold tracking-tight">
              <span className="text-[hsl(var(--primary-foreground))]">MITRA </span>
              <span className="text-[hsl(var(--accent))]">Dashboard</span>
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Accessibility Controls */}
            <div className="flex items-center gap-2 border-r border-border pr-4">
              <span className="text-xs text-[hsl(var(--primary-foreground))] mr-2">Accessibility</span>
              
              {/* Font Size Controls */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={decreaseFontSize}
                  className="h-8 w-8 p-0 text-[hsl(var(--primary-foreground))]"
                  title="Decrease font size"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFontSize}
                  className="h-8 w-8 p-0 text-[hsl(var(--primary-foreground))]"
                  title="Reset font size"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={increaseFontSize}
                  className="h-8 w-8 p-0 text-[hsl(var(--primary-foreground))]"
                  title="Increase font size"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="h-8 w-8 p-0 text-[hsl(var(--primary-foreground))]"
                title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? (
                  <Sun className="h-3 w-3" />
                ) : (
                  <Moon className="h-3 w-3" />
                )}
              </Button>
            </div>
            <h6 className="text-xs font-semibold text-[hsl(var(--accent))]">
              As reported in the NITI Aayog's Aspirational Block Development Programme Quarterly Delta Report
            </h6>
            {/* Uncomment for live data/last updated */}
            {/* 
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/10">
              Live Data
            </Badge>
            <div className="text-sm text-muted-foreground">
              Last Updated: {new Date().toLocaleTimeString()}
            </div>
            */}
          </div>
        </div>
      </div>
    </nav>
  );
};

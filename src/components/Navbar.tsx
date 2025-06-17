
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-foreground">MITRA Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Accessibility Controls */}
            <div className="flex items-center gap-2 border-r border-border pr-4">
              <div className="text-xs text-muted-foreground mr-2">Accessibility</div>
              
              {/* Font Size Controls */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={decreaseFontSize}
                  className="h-8 w-8 p-0"
                  title="Decrease font size"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFontSize}
                  className="h-8 w-8 p-0"
                  title="Reset font size"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={increaseFontSize}
                  className="h-8 w-8 p-0"
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
                className="h-8 w-8 p-0"
                title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? (
                  <Sun className="h-3 w-3" />
                ) : (
                  <Moon className="h-3 w-3" />
                )}
              </Button>
            </div>

            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/10">
              Live Data
            </Badge>
            <div className="text-sm text-muted-foreground">
              Last Updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

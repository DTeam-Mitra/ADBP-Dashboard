
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Minus, Plus, RotateCcw, Moon, Sun } from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export const AccessibilityToolbar: React.FC = () => {
  const {
    fontSize,
    isDarkMode,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    toggleDarkMode,
  } = useAccessibility();

  return (
    <Card className="fixed top-20 right-4 z-50 p-3 bg-background/95 backdrop-blur-sm border-border shadow-lg">
      <div className="flex items-center gap-2">
        <div className="text-xs text-muted-foreground mr-2">Accessibility</div>
        
        {/* Font Size Controls */}
        <div className="flex items-center gap-1 border-r border-border pr-2">
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
    </Card>
  );
};

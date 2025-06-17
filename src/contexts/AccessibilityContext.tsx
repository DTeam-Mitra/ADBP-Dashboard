
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  fontSize: number;
  isDarkMode: boolean;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  toggleDarkMode: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSize] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedFontSize = localStorage.getItem('accessibility-font-size');
    const savedDarkMode = localStorage.getItem('accessibility-dark-mode');
    
    if (savedFontSize) {
      setFontSize(parseFloat(savedFontSize));
    }
    
    if (savedDarkMode) {
      setIsDarkMode(savedDarkMode === 'true');
    }
  }, []);

  useEffect(() => {
    // Save font size to localStorage
    localStorage.setItem('accessibility-font-size', fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    // Save dark mode preference to localStorage
    localStorage.setItem('accessibility-dark-mode', isDarkMode.toString());
    
    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 0.1, 1.5));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 0.1, 0.8));
  };

  const resetFontSize = () => {
    setFontSize(1);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <AccessibilityContext.Provider value={{
      fontSize,
      isDarkMode,
      increaseFontSize,
      decreaseFontSize,
      resetFontSize,
      toggleDarkMode,
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

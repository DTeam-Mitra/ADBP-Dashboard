
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { ChatInterface } from './ChatInterface';

export const CollapsibleChatSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`transition-all duration-300 ${isOpen ? 'w-80' : 'w-12'} bg-sidebar-background border-r border-sidebar-border flex flex-col sidebar-chat`}>
      {/* Toggle Button */}
      <div className="p-2 border-b border-sidebar-border flex justify-between items-center bg-sidebar-background">
        {isOpen && (
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-sidebar-primary" />
            <h3 className="text-lg font-semibold text-sidebar-foreground">MITRA Assistant</h3>
          </div>
        )}
        {/* <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="h-8 w-8 p-0 hover:bg-sidebar-accent text-sidebar-foreground"
        >
          {isOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button> */}
      </div>

      {/* Chat Content */}
      {isOpen && (
        <>
          <div className="px-4 py-2 border-b border-sidebar-border bg-sidebar-background">
            <p className="text-sm text-sidebar-foreground/70">Ask me about the dashboard data</p>
          </div>
          <div className="flex-1">
            <ChatInterface />
          </div>
        </>
      )}

      {/* Collapsed State */}
      {!isOpen && (
        <div className="flex-1 flex items-center justify-center bg-sidebar-background">
          <MessageCircle className="h-6 w-6 text-sidebar-foreground/60" />
        </div>
      )}
    </div>
  );
};

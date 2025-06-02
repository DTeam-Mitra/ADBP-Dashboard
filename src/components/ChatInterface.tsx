
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  message: string;
  timestamp: Date;
  isUser: boolean;
}

export const ChatInterface = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: message.trim(),
      timestamp: new Date(),
      isUser: true
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      // TODO: Replace with actual webhook endpoint
      const webhookUrl = process.env.VITE_CHATBOT_WEBHOOK_URL || 'YOUR_WEBHOOK_URL_HERE';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.message,
          timestamp: userMessage.timestamp.toISOString(),
          sessionId: 'user-session', // Generate proper session ID
        }),
      });

      if (response.ok) {
        const botResponse = await response.json();
        
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          message: botResponse.message || 'Response received from bot',
          timestamp: new Date(),
          isUser: false
        };

        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please check webhook configuration.",
        variant: "destructive",
      });
      
      // Add mock response for demo
      const mockResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: 'Hello! I am the MITRA chatbot. How can I help you with the dashboard data?',
        timestamp: new Date(),
        isUser: false
      };
      setMessages(prev => [...prev, mockResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full bg-white/95 backdrop-blur-sm shadow-lg">
      {/* Chat Messages */}
      <div className="h-32 p-3 overflow-y-auto space-y-2">
        {messages.length === 0 && (
          <div className="text-sm text-gray-500 text-center">
            Start a conversation with the MITRA assistant
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`text-xs p-2 rounded ${
              msg.isUser 
                ? 'bg-blue-100 text-blue-800 ml-4' 
                : 'bg-gray-100 text-gray-800 mr-4'
            }`}
          >
            {msg.message}
          </div>
        ))}
        {isLoading && (
          <div className="text-xs text-gray-500 mr-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input Section */}
      <div className="border-t p-3">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Chat with me Here"
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="sm" 
            className="px-3"
            disabled={isLoading || !message.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
};

"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { Send, Bot, Loader2, X } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ClientAIChatProps {
  sowId: string;
  showChat: boolean;
  onClose: () => void;
}

export default function ClientAIChat({ sowId, showChat, onClose }: ClientAIChatProps) {
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showChat) {
      // You might want to load initial messages or context here
      console.log("Client AI Chat is now visible for SOW:", sowId);
    }
  }, [showChat, sowId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: chatInput,
      timestamp: Date.now(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setIsLoading(true);

    try {
      // NOTE: This is a placeholder. You'll need a real API endpoint
      // to handle client-side chat interactions.
      // This endpoint would likely be different from the internal one.
      const response = await fetch('/api/portal/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sowId,
          message: chatInput,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get a response from the AI.');
      }

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "I'm sorry, I couldn't process that.",
        timestamp: Date.now(),
      };
      setChatMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error("Chat API error:", error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting. Please try again later.",
        timestamp: Date.now(),
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!showChat) return null;

  return (
    <div className="fixed bottom-20 right-6 w-96 h-[60vh] bg-white dark:bg-gray-900 shadow-2xl rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col z-50">
      <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-bold text-lg text-gray-800 dark:text-white">Ask about this SOW</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {chatMessages.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <Bot className="h-12 w-12 mx-auto mb-2" />
              <p>Ask me anything about this Statement of Work. For example: "Summarize the key deliverables."</p>
            </div>
          ) : (
            chatMessages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                <div className={`max-w-[85%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm dark:prose-invert max-w-none">
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-2">
              <div className="max-w-[85%] p-3 rounded-lg bg-gray-200 dark:bg-gray-700">
                <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t dark:border-gray-700">
        <div className="relative">
          <Textarea
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your question..."
            className="pr-12 rounded-lg"
            rows={1}
          />
          <Button
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={handleSendMessage}
            disabled={isLoading || !chatInput.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

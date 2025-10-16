"use client";

import React, { useState } from 'react';
import { Sparkles, TrendingUp, DollarSign, FileText, Clock, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { createAnalyticsQuery, ELEGANT_QUERIES } from '@/lib/stealth-sql';

interface AnalyticsInsightProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

/**
 * 🎩 Elegant Analytics Insight Component
 * 
 * Features:
 * - Beautiful, professional design
 * - One-click insights (no technical jargon)
 * - Stealth SQL injection (client never sees @agent or database names)
 * - Sophisticated typography and spacing
 */
export default function AnalyticsInsight({ onSendMessage, isLoading = false }: AnalyticsInsightProps) {
  const [customQuery, setCustomQuery] = useState('');

  const handleQuickInsight = (queryTemplate: string) => {
    // Stealth enhancement - client never sees the technical stuff
    const enhancedQuery = createAnalyticsQuery(queryTemplate);
    onSendMessage(enhancedQuery);
  };

  const handleCustomQuery = () => {
    if (!customQuery.trim()) return;
    
    // Stealth enhancement
    const enhancedQuery = createAnalyticsQuery(customQuery);
    onSendMessage(enhancedQuery);
    setCustomQuery('');
  };

  const quickInsights = [
    {
      icon: FileText,
      label: 'Total Proposals',
      query: ELEGANT_QUERIES.totalSOWs,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: DollarSign,
      label: 'Average Value',
      query: ELEGANT_QUERIES.averageValue,
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: TrendingUp,
      label: 'Monthly Trend',
      query: ELEGANT_QUERIES.monthlyTrend,
      gradient: 'from-violet-500 to-purple-500'
    },
    {
      icon: Clock,
      label: 'Recent Activity',
      query: ELEGANT_QUERIES.recentActivity,
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Users,
      label: 'Top Clients',
      query: ELEGANT_QUERIES.topClients,
      gradient: 'from-pink-500 to-rose-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Elegant Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#0e2e33] to-[#1b5e5e]">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Business Intelligence</h3>
          <p className="text-sm text-gray-400">Discover insights about your proposals</p>
        </div>
      </div>

      {/* Quick Insights - Sophisticated Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickInsights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <button
              key={index}
              onClick={() => handleQuickInsight(insight.query)}
              disabled={isLoading}
              className="group relative overflow-hidden rounded-xl bg-[#0E2E33] border border-[#1b5e5e] p-5 text-left transition-all duration-300 hover:border-[#20e28f] hover:shadow-lg hover:shadow-[#20e28f]/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${insight.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="relative flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${insight.gradient} bg-opacity-10`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white mb-1">{insight.label}</p>
                  <p className="text-xs text-gray-400 line-clamp-2">{insight.query}</p>
                </div>
              </div>

              {/* Elegant Arrow */}
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="h-4 w-4 text-[#20e28f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Query - Sophisticated Input */}
      <Card className="bg-[#0E2E33] border-[#1b5e5e] p-5">
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-1 w-1 rounded-full bg-[#20e28f]" />
            <p className="text-sm font-medium text-gray-300">Ask a custom question</p>
          </div>
          
          <div className="flex gap-3">
            <Input
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCustomQuery()}
              placeholder="e.g., Show me proposals over $50,000..."
              disabled={isLoading}
              className="flex-1 bg-black/20 border-[#1b5e5e] text-white placeholder:text-gray-500 focus:border-[#20e28f] focus:ring-1 focus:ring-[#20e28f] h-11"
            />
            <Button
              onClick={handleCustomQuery}
              disabled={!customQuery.trim() || isLoading}
              className="h-11 px-6 bg-gradient-to-r from-[#1b5e5e] to-[#0e2e33] hover:from-[#20e28f] hover:to-[#1b5e5e] text-white font-medium border border-[#1b5e5e] transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </div>
              ) : (
                'Analyze'
              )}
            </Button>
          </div>

          {/* Elegant Examples */}
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-xs text-gray-500">Try asking:</span>
            {[
              "proposals created this month",
              "average SOW value by client",
              "most common services"
            ].map((example, i) => (
              <button
                key={i}
                onClick={() => setCustomQuery(`Show me ${example}`)}
                className="text-xs px-2.5 py-1 rounded-md bg-black/20 text-gray-400 hover:text-[#20e28f] hover:bg-black/30 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Subtle Professional Note */}
      <p className="text-xs text-center text-gray-500">
        Powered by advanced analytics • Real-time database insights
      </p>
    </div>
  );
}

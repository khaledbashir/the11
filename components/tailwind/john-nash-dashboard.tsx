"use client";

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Target, Users, 
  AlertTriangle, Lightbulb, Calendar, BarChart3, PieChart,
  Clock, Zap, Award, Activity, Brain, TrendingUpIcon
} from 'lucide-react';

// Types
interface Metric {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  status?: 'good' | 'warning' | 'danger';
}

interface Service {
  name: string;
  avgValue: number;
  winRate: number;
  deliveryCost: number;
  margin: number;
  volume: number;
}

interface ClientHealth {
  name: string;
  score: number;
  status: 'healthy' | 'at-risk' | 'churn';
  lastContact: string;
  cltv: number;
}

interface AIInsight {
  type: 'warning' | 'opportunity' | 'prediction' | 'action';
  message: string;
  confidence?: number;
  action?: string;
}

interface DashboardStats {
  revenue: {
    current: number;
    previous: number;
    forecast: number;
    velocity: number;
  };
  pipeline: {
    total: number;
    weighted: number;
    coverage: number;
    deals: number;
  };
  winRate: {
    overall: number;
    byService: Record<string, number>;
    trend: number;
  };
  clients: {
    total: number;
    healthy: number;
    atRisk: number;
    churnRisk: number;
    cltv: number;
  };
  services: Service[];
  clientHealth: ClientHealth[];
  insights: AIInsight[];
  predictions: {
    revenue30Days: { value: number; confidence: number };
    newClients: number;
    renewals: number;
    churnProbability: number;
  };
}

export default function JohnNashDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'clients' | 'predictions'>('overview');

  useEffect(() => {
    fetchDashboardStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchDashboardStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/analytics/nash-dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#20e28f]"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        No data available
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1f23] via-[#0e2e33] to-[#0a1f23] text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#20e28f] to-[#1b5e5e] bg-clip-text text-transparent mb-2">
          Intelligence Dashboard
        </h1>
        <p className="text-gray-400">Real-time business intelligence powered by AI</p>
      </div>

      {/* Hero Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon={<DollarSign className="w-8 h-8" />}
          label="Revenue This Month"
          value={formatCurrency(stats.revenue.current)}
          change={calculateChange(stats.revenue.current, stats.revenue.previous)}
          trend={stats.revenue.current > stats.revenue.previous ? 'up' : 'down'}
        />
        <MetricCard
          icon={<Activity className="w-8 h-8" />}
          label="Pipeline Health"
          value={`${stats.pipeline.coverage.toFixed(1)}x`}
          subtitle="Coverage Ratio"
          status={stats.pipeline.coverage >= 3 ? 'good' : stats.pipeline.coverage >= 2 ? 'warning' : 'danger'}
        />
        <MetricCard
          icon={<Target className="w-8 h-8" />}
          label="Win Rate"
          value={`${stats.winRate.overall.toFixed(0)}%`}
          change={stats.winRate.trend}
          trend={stats.winRate.trend > 0 ? 'up' : 'down'}
        />
        <MetricCard
          icon={<Zap className="w-8 h-8" />}
          label="Revenue Velocity"
          value={formatCurrency(stats.revenue.velocity)}
          subtitle="per week"
          trend="up"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-700">
        {[
          { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'services', label: 'Services', icon: <Award className="w-4 h-4" /> },
          { id: 'clients', label: 'Clients', icon: <Users className="w-4 h-4" /> },
          { id: 'predictions', label: 'Predictions', icon: <Brain className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-[#20e28f] text-[#20e28f]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && <OverviewTab stats={stats} />}
          {activeTab === 'services' && <ServicesTab services={stats.services} />}
          {activeTab === 'clients' && <ClientsTab clients={stats.clientHealth} />}
          {activeTab === 'predictions' && <PredictionsTab stats={stats} />}
        </div>

        {/* AI Insights Sidebar */}
        <div className="lg:col-span-1">
          <AIInsightsFeed insights={stats.insights} />
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ icon, label, value, subtitle, change, trend, status }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  status?: 'good' | 'warning' | 'danger';
}) {
  const statusColors = {
    good: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
    warning: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
    danger: 'from-red-500/20 to-pink-500/20 border-red-500/30',
  };

  return (
    <div className={`
      relative overflow-hidden rounded-2xl p-6 
      backdrop-blur-xl border
      bg-gradient-to-br ${status ? statusColors[status] : 'from-[#1b5e5e]/20 to-[#0e2e33]/20 border-[#1b5e5e]/30'}
      hover:border-[#20e28f]/50 transition-all duration-300
      group cursor-pointer
    `}>
      {/* Gradient orb */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#20e28f]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#20e28f]/20 transition-colors" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#20e28f]/20 to-[#1b5e5e]/20 text-[#20e28f]">
            {icon}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${
              trend === 'up' ? 'text-green-400' : 'text-red-400'
            }`}>
              {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {change && <span>{Math.abs(change).toFixed(1)}%</span>}
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

// Overview Tab
function OverviewTab({ stats }: { stats: DashboardStats }) {
  return (
    <div className="space-y-6">
      {/* Pipeline Overview */}
      <div className="rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-[#1b5e5e]/20 to-[#0e2e33]/20 border border-[#1b5e5e]/30">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-[#20e28f]" />
          Pipeline Breakdown
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Total Pipeline</p>
            <p className="text-2xl font-bold">{formatCurrency(stats.pipeline.total)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Weighted Value</p>
            <p className="text-2xl font-bold">{formatCurrency(stats.pipeline.weighted)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Active Deals</p>
            <p className="text-2xl font-bold">{stats.pipeline.deals}</p>
          </div>
        </div>
      </div>

      {/* Client Health Distribution */}
      <div className="rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-[#1b5e5e]/20 to-[#0e2e33]/20 border border-[#1b5e5e]/30">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#20e28f]" />
          Client Health Distribution
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl bg-green-500/10 border border-green-500/30">
            <p className="text-3xl font-bold text-green-400">{stats.clients.healthy}</p>
            <p className="text-sm text-gray-400 mt-1">Healthy</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
            <p className="text-3xl font-bold text-yellow-400">{stats.clients.atRisk}</p>
            <p className="text-sm text-gray-400 mt-1">At Risk</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <p className="text-3xl font-bold text-red-400">{stats.clients.churnRisk}</p>
            <p className="text-sm text-gray-400 mt-1">Churn Risk</p>
          </div>
        </div>
      </div>

      {/* Win Rate by Service */}
      <div className="rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-[#1b5e5e]/20 to-[#0e2e33]/20 border border-[#1b5e5e]/30">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-[#20e28f]" />
          Win Rate by Service
        </h3>
        <div className="space-y-3">
          {Object.entries(stats.winRate.byService).map(([service, rate]) => (
            <div key={service}>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">{service}</span>
                <span className="text-sm font-semibold text-[#20e28f]">{rate.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-700/30 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[#20e28f] to-[#1b5e5e] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Services Tab
function ServicesTab({ services }: { services: Service[] }) {
  return (
    <div className="rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-[#1b5e5e]/20 to-[#0e2e33]/20 border border-[#1b5e5e]/30">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-[#20e28f]" />
        Service Performance Matrix
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-2 text-sm text-gray-400">Service</th>
              <th className="text-right py-3 px-2 text-sm text-gray-400">Volume</th>
              <th className="text-right py-3 px-2 text-sm text-gray-400">Avg Value</th>
              <th className="text-right py-3 px-2 text-sm text-gray-400">Win Rate</th>
              <th className="text-right py-3 px-2 text-sm text-gray-400">Margin</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, idx) => (
              <tr key={idx} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                <td className="py-3 px-2 font-medium">{service.name}</td>
                <td className="py-3 px-2 text-right text-gray-300">{service.volume}</td>
                <td className="py-3 px-2 text-right text-gray-300">{formatCurrency(service.avgValue)}</td>
                <td className="py-3 px-2 text-right">
                  <span className={`px-2 py-1 rounded text-xs ${
                    service.winRate >= 75 ? 'bg-green-500/20 text-green-400' :
                    service.winRate >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {service.winRate.toFixed(0)}%
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  <span className="text-[#20e28f] font-semibold">{service.margin.toFixed(0)}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Clients Tab
function ClientsTab({ clients }: { clients: ClientHealth[] }) {
  return (
    <div className="space-y-4">
      {clients.map((client, idx) => (
        <div
          key={idx}
          className={`rounded-2xl p-6 backdrop-blur-xl border transition-all duration-300 hover:scale-[1.02] ${
            client.status === 'healthy' 
              ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30'
              : client.status === 'at-risk'
              ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30'
              : 'bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-500/30'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold">{client.name}</h4>
              <p className="text-sm text-gray-400">Last contact: {client.lastContact}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{client.score}</p>
              <p className="text-xs text-gray-400">Health Score</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              client.status === 'healthy' 
                ? 'bg-green-500/20 text-green-400'
                : client.status === 'at-risk'
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {client.status.toUpperCase()}
            </span>
            <span className="text-sm text-gray-400">
              CLTV: <span className="text-[#20e28f] font-semibold">{formatCurrency(client.cltv)}</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// Predictions Tab
function PredictionsTab({ stats }: { stats: DashboardStats }) {
  return (
    <div className="space-y-6">
      {/* 30-Day Forecast */}
      <div className="rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-[#1b5e5e]/20 to-[#0e2e33]/20 border border-[#1b5e5e]/30">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-[#20e28f]" />
          30-Day Revenue Forecast
        </h3>
        <div className="text-center py-8">
          <p className="text-5xl font-bold text-[#20e28f] mb-2">
            {formatCurrency(stats.predictions.revenue30Days.value)}
          </p>
          <p className="text-sm text-gray-400 mb-4">Predicted Revenue</p>
          <div className="flex items-center justify-center gap-2">
            <div className="px-3 py-1 rounded-full bg-[#20e28f]/20 text-[#20e28f] text-sm">
              {stats.predictions.revenue30Days.confidence.toFixed(0)}% Confidence
            </div>
          </div>
        </div>
      </div>

      {/* New Clients & Renewals */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30">
          <p className="text-sm text-gray-400 mb-2">New Clients</p>
          <p className="text-4xl font-bold">{stats.predictions.newClients}</p>
        </div>
        <div className="rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30">
          <p className="text-sm text-gray-400 mb-2">Renewals</p>
          <p className="text-4xl font-bold">{stats.predictions.renewals}</p>
        </div>
      </div>

      {/* Churn Risk */}
      <div className="rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          Churn Risk Analysis
        </h4>
        <div className="text-center">
          <p className="text-4xl font-bold text-red-400 mb-2">
            {stats.predictions.churnProbability.toFixed(0)}%
          </p>
          <p className="text-sm text-gray-400">Predicted churn rate next quarter</p>
        </div>
      </div>
    </div>
  );
}

// AI Insights Feed
function AIInsightsFeed({ insights }: { insights: AIInsight[] }) {
  const iconMap = {
    warning: <AlertTriangle className="w-5 h-5" />,
    opportunity: <Lightbulb className="w-5 h-5" />,
    prediction: <Brain className="w-5 h-5" />,
    action: <Zap className="w-5 h-5" />,
  };

  const colorMap = {
    warning: 'from-red-500/20 to-orange-500/20 border-red-500/30 text-red-400',
    opportunity: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400',
    prediction: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400',
    action: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
  };

  return (
    <div className="rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-[#1b5e5e]/20 to-[#0e2e33]/20 border border-[#1b5e5e]/30 sticky top-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Brain className="w-5 h-5 text-[#20e28f]" />
        AI Insights
      </h3>
      <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
        {insights.map((insight, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl backdrop-blur-xl border bg-gradient-to-br ${colorMap[insight.type]} transition-all hover:scale-[1.02]`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {iconMap[insight.type]}
              </div>
              <div className="flex-1">
                <p className="text-sm text-white mb-2">{insight.message}</p>
                {insight.confidence && (
                  <p className="text-xs text-gray-400 mb-2">
                    Confidence: {insight.confidence}%
                  </p>
                )}
                {insight.action && (
                  <button className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    {insight.action}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Utility Functions
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function calculateChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

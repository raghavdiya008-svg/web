'use client';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Activity, BarChart2 } from 'lucide-react';

const DOWNLOADS_BY_CATEGORY = [
  { category: 'SFX Packs', count: 0, color: '#06B6D4' },
  { category: 'Color LUTs', count: 0, color: '#A78BFA' },
  { category: 'Contracts', count: 0, color: '#F59E0B' },
  { category: '3D Kinetics', count: 0, color: '#10B981' },
  { category: 'Film Overlays', count: 0, color: '#EF4444' },
  { category: 'Typography', count: 0, color: '#8B5CF6' },
];

const REGISTRATIONS_DATA = [
  { date: 'Initial', users: 0 },
];

const TRAFFIC_SOURCES = [
  { name: 'Vercel Analytics Stream', value: 100, color: '#00FF41' },
];

const TOP_SEARCH_QUERIES = [
  { query: 'kodak 500t lut', searches: 0, growth: 'Awaiting telemetries' },
  { query: 'trailer sub impact', searches: 0, growth: 'Awaiting telemetries' },
  { query: 'kinetic typography', searches: 0, growth: 'Awaiting telemetries' },
  { query: 'freelance invoice', searches: 0, growth: 'Awaiting telemetries' },
];

export function AnalyticsCharts() {
  return (
    <div className="space-y-8">
      {/* VERCEL TELEMETRY NOTICE */}
      <div className="bg-[#111111] border border-[#1A1A1A] p-4 rounded-[2px] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse" />
          <span className="font-mono text-xs text-[#E4E4E7]">
            Vercel Analytics & Speed Insights tracking engine active.
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#71717A] uppercase">
          Real telemetry stream
        </span>
      </div>

      {/* OVERVIEW STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '30-Day Total Grabs', value: '0', delta: 'Real-time telemetry' },
          { label: 'Registered Creators', value: '0', delta: 'Awaiting signups' },
          { label: 'Vercel Tracking', value: '100% OK', delta: 'Insights stream live' },
          { label: 'Active Vault Catalog', value: '5 Assets', delta: 'Verified packages' },
        ].map((item) => (
          <div key={item.label} className="bg-[#111111] border border-[#1A1A1A] p-5 rounded-[2px] space-y-1">
            <span className="font-mono text-[10px] text-[#3F3F46] uppercase tracking-wider block">
              {item.label}
            </span>
            <div className="font-display text-2xl lg:text-3xl text-white font-medium">{item.value}</div>
            <p className="font-mono text-[11px] text-[#00FF41]">{item.delta}</p>
          </div>
        ))}
      </div>

      {/* CHARTS ROW 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DOWNLOADS BY CATEGORY (BAR) */}
        <div className="bg-[#111111] border border-[#1A1A1A] p-6 rounded-[2px] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]">
            <h3 className="font-display text-base text-white">Downloads by Category</h3>
            <span className="font-mono text-[10px] text-[#71717A] uppercase">All-time volume</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DOWNLOADS_BY_CATEGORY} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                <XAxis
                  dataKey="category"
                  stroke="#3F3F46"
                  tick={{ fill: '#71717A', fontSize: 10, fontFamily: 'monospace' }}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis stroke="#3F3F46" tick={{ fill: '#71717A', fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A0A0A',
                    borderColor: '#1A1A1A',
                    borderRadius: '2px',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="count" fill="#06B6D4" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* REGISTRATIONS PER DAY (LINE) */}
        <div className="bg-[#111111] border border-[#1A1A1A] p-6 rounded-[2px] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]">
            <h3 className="font-display text-base text-white">New User Signups</h3>
            <span className="font-mono text-[10px] text-[#71717A] uppercase">30-day velocity</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REGISTRATIONS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#3F3F46"
                  tick={{ fill: '#71717A', fontSize: 10, fontFamily: 'monospace' }}
                />
                <YAxis stroke="#3F3F46" tick={{ fill: '#71717A', fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A0A0A',
                    borderColor: '#1A1A1A',
                    borderRadius: '2px',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#A78BFA"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#A78BFA' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CHARTS ROW 2: TRAFFIC & SEARCH QUERIES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TRAFFIC SOURCES */}
        <div className="bg-[#111111] border border-[#1A1A1A] p-6 rounded-[2px] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]">
            <h3 className="font-display text-base text-white">Traffic Acquisition</h3>
            <span className="font-mono text-[10px] text-[#71717A] uppercase">Referral share</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={TRAFFIC_SOURCES}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {TRAFFIC_SOURCES.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2 w-full">
              {TRAFFIC_SOURCES.map((src) => (
                <div key={src.name} className="flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-[#71717A]">{src.name}</span>
                  </div>
                  <span className="text-white font-medium">{src.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TOP SEARCH QUERIES IN /VAULT */}
        <div className="bg-[#111111] border border-[#1A1A1A] p-6 rounded-[2px] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]">
            <h3 className="font-display text-base text-white">Top Vault Search Queries</h3>
            <span className="font-mono text-[10px] text-[#71717A] uppercase">Creator intent</span>
          </div>
          <div className="divide-y divide-[#1A1A1A]">
            {TOP_SEARCH_QUERIES.map((q, idx) => (
              <div key={q.query} className="py-2.5 flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-[#3F3F46] w-4">{idx + 1}.</span>
                  <span className="text-white">&ldquo;{q.query}&rdquo;</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#71717A]">{q.searches.toLocaleString()}</span>
                  <span className="text-accent text-[10px]">{q.growth}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
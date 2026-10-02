import { Metadata } from 'next';
import { AnalyticsCharts } from '@/components/admin/AnalyticsCharts';

export const metadata: Metadata = {
  title: 'Full Analytics — EditX Vault Admin',
};

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-10">
      <div className="pb-6 border-b border-[#1A1A1A]">
        <span className="font-mono text-[10px] text-[#3F3F46] uppercase tracking-wider block mb-1">
          Telemetry & Intelligence
        </span>
        <h1 className="font-display text-2xl lg:text-3xl text-white tracking-tight">
          Performance & Analytics Dashboard
        </h1>
        <p className="text-sm text-[#71717A] mt-2">
          Real-time metrics on asset grab volumes, category popularity, creator growth rate, and inbound traffic sources.
        </p>
      </div>

      <AnalyticsCharts />
    </div>
  );
}

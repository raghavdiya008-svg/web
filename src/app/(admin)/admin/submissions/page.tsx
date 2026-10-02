import { Metadata } from 'next';
import { SubmissionsQueue } from '@/components/admin/SubmissionsQueue';

export const metadata: Metadata = {
  title: 'Submissions Queue — EditX Vault Admin',
};

export default function AdminSubmissionsPage() {
  return (
    <div className="space-y-10">
      <div className="pb-6 border-b border-[#1A1A1A]">
        <span className="font-mono text-[10px] text-[#3F3F46] uppercase tracking-wider block mb-1">
          Curation Workflow
        </span>
        <h1 className="font-display text-2xl lg:text-3xl text-white tracking-tight">
          Community Submissions Queue
        </h1>
        <p className="text-sm text-[#71717A] mt-2">
          Review community-suggested assets, test source links, verify open-source licenses, and push to drop queue.
        </p>
      </div>

      <SubmissionsQueue />
    </div>
  );
}

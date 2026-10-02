import { auth } from '@/lib/auth/config';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { cn } from '@/lib/utils/cn';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  const isDev = process.env.NODE_ENV === 'development';
  const isAdmin = session?.user?.role === 'admin';

  if (!isAdmin && !isDev) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-white p-4">
        <div className="text-center space-y-3 bg-[#111111] border border-[#1A1A1A] p-10 rounded-[2px] max-w-md">
          <span className="font-mono text-xs text-red-400 uppercase tracking-widest block">
            Security Exception
          </span>
          <h1 className="font-display text-2xl font-bold text-white">403 — Unauthorized</h1>
          <p className="text-xs text-[#71717A] leading-relaxed">
            Admin access required. Your Discord account does not possess elevated role permissions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-[#F5F5F5]">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {isDev && !isAdmin && (
          <div className="mb-6 p-3 bg-accent/10 border border-accent/30 rounded-[2px] flex items-center justify-between text-xs font-mono text-accent">
            <span>[DEV MODE] Previewing Admin Dashboard as Superadmin bypass</span>
            <span className="text-[10px] text-[#71717A]">Production enforces strict Discord role checks</span>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
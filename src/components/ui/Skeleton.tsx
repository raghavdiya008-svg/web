'use client';
import { cn } from '@/lib/utils/cn';

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-suite-deep/60 rounded-[2px] animate-pulse',
        className
      )}
    />
  );
}

export function DropCardSkeleton() {
  return (
    <div className="bg-suite-deep border border-border p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="pt-4 border-t border-border flex justify-between">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-7 w-20" />
      </div>
    </div>
  );
}
export default function Loading() {
  return (
    <div className="flex-1 min-h-[60vh] flex items-center justify-center p-6 bg-[#070708]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-[#27272A] border-t-[#FFFFFF] animate-spin rounded-none" />
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#FFFFFF] animate-pulse" />
          <span className="font-mono text-[9px] font-black tracking-[0.24em] text-[#A1A1AA] uppercase">
            CALIBRATING ASSET REPOSITORY...
          </span>
        </div>
      </div>
    </div>
  );
}

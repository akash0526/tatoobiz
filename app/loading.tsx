export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center animate-pulse">
          <span className="text-black font-heading text-xl font-bold tracking-tighter">TB</span>
        </div>
        <div className="text-xs tracking-[3px] text-gold/70">LOADING STUDIO...</div>
      </div>
    </div>
  );
}

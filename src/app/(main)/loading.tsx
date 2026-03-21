export default function MainLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="h-[90vh] bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="max-w-3xl mx-auto w-full px-4 text-center space-y-8">
          <div className="h-8 w-40 bg-white/10 rounded-full mx-auto animate-pulse" />
          <div className="space-y-4">
            <div className="h-14 w-3/4 bg-white/10 rounded-2xl mx-auto animate-pulse" />
            <div className="h-14 w-1/2 bg-white/10 rounded-2xl mx-auto animate-pulse" />
          </div>
          <div className="h-6 w-2/3 bg-white/10 rounded-xl mx-auto animate-pulse" />
          <div className="h-14 w-full max-w-xl bg-white/10 rounded-2xl mx-auto animate-pulse" />
        </div>
      </div>
    </div>
  );
}

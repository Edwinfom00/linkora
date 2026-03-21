export default function EntreprisesLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-indigo/5 via-cyan/5 to-transparent py-12 md:py-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-48 bg-muted rounded-xl animate-pulse mb-2" />
          <div className="h-5 w-64 bg-muted rounded-lg animate-pulse mb-8" />
          <div className="h-14 max-w-3xl bg-muted rounded-2xl animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[320px] rounded-2xl bg-muted animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

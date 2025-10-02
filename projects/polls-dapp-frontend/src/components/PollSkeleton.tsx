function PollSkeleton() {
  return (
    <div className="backdrop-blur-md bg-white/40 border border-white/60 rounded-2xl p-6 shadow-xl flex flex-col animate-pulse">
      <div className="h-6 bg-gray-300/50 rounded-lg mb-4 w-3/4"></div>

      <div className="space-y-3 mb-6 flex-grow">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/60">
            <div className="h-5 bg-gray-300/50 rounded w-2/3"></div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
        <div className="h-4 bg-gray-300/50 rounded w-20"></div>
        <div className="h-9 bg-gray-300/50 rounded-lg w-20"></div>
      </div>
    </div>
  )
}

export default PollSkeleton

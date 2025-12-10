export interface ListSkeletonProps {
  count?: number
  itemHeight?: string
}

export default function ListSkeleton({ count = 3, itemHeight = 'h-32' }: ListSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${itemHeight} w-full rounded-lg border border-gray-200 bg-white p-4 animate-pulse`}
        >
          <div className="flex gap-4">
            <div className="h-20 w-20 rounded-lg bg-gray-200"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 w-3/4 rounded bg-gray-200"></div>
              <div className="h-3 w-1/2 rounded bg-gray-200"></div>
              <div className="h-3 w-2/3 rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


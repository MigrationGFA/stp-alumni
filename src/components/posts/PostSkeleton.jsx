/**
 * PostSkeleton component - Loading placeholder for posts
 */
export default function PostSkeleton() {
  return (
    <div className="bg-white rounded-lg p-4 lg:p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-3">
          <div className="h-12 w-12 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-3 w-48 bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="h-8 w-20 bg-gray-200 rounded" />
      </div>

      {/* Content */}
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
      </div>

      {/* Image placeholder */}
      <div className="h-64 bg-gray-200 rounded-lg mb-4" />

      {/* Actions */}
      <div className="flex items-center pt-4 border-t border-gray-200">
        <div className="flex-1 flex items-center justify-center gap-2">
          <div className="h-5 w-5 bg-gray-200 rounded" />
          <div className="h-4 w-12 bg-gray-200 rounded" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-2">
          <div className="h-5 w-5 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

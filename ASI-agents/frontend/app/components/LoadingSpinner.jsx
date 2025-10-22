'use client'

export default function LoadingSpinner({ message = 'Processing...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="w-16 h-16 border-4 border-purple-900/30 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full animate-ping opacity-20">
          <div className="w-16 h-16 border-4 border-cyan-500 rounded-full"></div>
        </div>
      </div>
      <p className="mt-4 text-gray-300 font-medium">{message}</p>
    </div>
  )
}

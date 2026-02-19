import { motion } from 'framer-motion';

export function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`${sizes[size]} border-2 border-primary/20 border-t-primary rounded-full ${className}`}
    />
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <Spinner size="lg" />
      <p className="mt-4 text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="mt-4 space-y-3">
        <div className="w-3/4 h-5 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="mt-4 flex gap-2">
        <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export default Spinner;

import React from 'react';
import { motion } from 'framer-motion';
interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: string;
  showLabel?: boolean;
}
export function ProgressBar({
  value,
  max = 100,
  className = '',
  color = 'bg-blue-600',
  showLabel = false
}: ProgressBarProps) {
  const percentage = Math.min(Math.max(value / max * 100, 0), 100);
  return <div className={`w-full ${className}`}>
      {showLabel && <div className="flex justify-between mb-1">
          <span className="text-xs font-medium text-gray-700">Progress</span>
          <span className="text-xs font-medium text-gray-700">
            {Math.round(percentage)}%
          </span>
        </div>}
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <motion.div className={`h-full ${color}`} initial={{
        width: 0
      }} animate={{
        width: `${percentage}%`
      }} transition={{
        duration: 0.8,
        ease: 'easeOut'
      }} />
      </div>
    </div>;
}
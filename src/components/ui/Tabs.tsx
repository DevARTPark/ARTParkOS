import React from 'react';
import { motion } from 'framer-motion';
interface Tab {
  id: string;
  label: string;
}
interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}
export function Tabs({
  tabs,
  activeTab,
  onChange,
  className = ''
}: TabsProps) {
  return <div className={`flex space-x-1 border-b border-gray-200 ${className}`}>
      {tabs.map(tab => <button key={tab.id} onClick={() => onChange(tab.id)} className={`
            relative px-4 py-2 text-sm font-medium transition-colors
            ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}
          `}>
          {tab.label}
          {activeTab === tab.id && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" initial={false} transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30
      }} />}
        </button>)}
    </div>;
}
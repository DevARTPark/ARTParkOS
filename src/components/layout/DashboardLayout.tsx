import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Role } from '../../types';
import { motion } from 'framer-motion';
interface DashboardLayoutProps {
  children: React.ReactNode;
  role: Role;
  title?: string;
}
export function DashboardLayout({
  children,
  role,
  title
}: DashboardLayoutProps) {
  return <div className="min-h-screen bg-gray-50 flex">
      <Sidebar role={role} />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header title={title} />
        <main className="flex-1 p-8 overflow-y-auto">
          <motion.div initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.4
        }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>;
}
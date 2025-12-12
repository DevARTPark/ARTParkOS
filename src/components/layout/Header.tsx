import React from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';
import { currentUser } from '../../data/mockData';
export function Header({
  title
}: {
  title?: string;
}) {
  return <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-800">
          {title || 'Dashboard'}
        </h1>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 bg-gray-50" />
        </div>

        <button className="relative text-gray-500 hover:text-gray-700">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center space-x-3 border-l border-gray-200 pl-6">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100" />
          <div className="hidden md:block text-sm">
            <p className="font-medium text-gray-700">{currentUser.name}</p>
            <p className="text-xs text-gray-500 capitalize">
              {currentUser.role}
            </p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </header>;
}
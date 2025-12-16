import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  MapPin, 
  ArrowRight,
  MoreHorizontal
} from 'lucide-react';

// --- Mock Data: Portfolio ---
const portfolioData = [
  {
    id: 's1',
    name: 'GreenField Tech',
    domain: 'AgriTech',
    airl: 3,
    status: 'Green',
    funding: '₹50L',
    runway: '8 Months',
    nextMilestone: 'Pilot Deployment',
    logo: 'https://ui-avatars.com/api/?name=Green+Field&background=10B981&color=fff'
  },
  {
    id: 's2',
    name: 'MediDrone Systems',
    domain: 'Healthcare',
    airl: 5,
    status: 'Yellow',
    funding: '₹1.2Cr',
    runway: '5 Months',
    nextMilestone: 'DGCA Approval',
    logo: 'https://ui-avatars.com/api/?name=Medi+Drone&background=3B82F6&color=fff'
  },
  {
    id: 's3',
    name: 'AutoBotics',
    domain: 'Robotics',
    airl: 2,
    status: 'Red',
    funding: '₹25L',
    runway: '2 Months',
    nextMilestone: 'Prototype V1',
    logo: 'https://ui-avatars.com/api/?name=Auto+Botics&background=EF4444&color=fff'
  },
  {
    id: 's4',
    name: 'SolarFlow',
    domain: 'CleanTech',
    airl: 6,
    status: 'Green',
    funding: '₹80L',
    runway: '12 Months',
    nextMilestone: 'Market Expansion',
    logo: 'https://ui-avatars.com/api/?name=Solar+Flow&background=F59E0B&color=fff'
  }
];

export function ReviewerPortfolio() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredStartups = portfolioData.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          s.domain.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout role="reviewer" title="Startup Portfolio">
      
      {/* Controls Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search by name, domain..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {['All', 'Green', 'Yellow', 'Red'].map(status => (
            <button 
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                statusFilter === status 
                  ? 'bg-slate-800 text-white border-slate-800' 
                  : 'bg-white text-slate-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
          <Button variant="outline" size="sm" leftIcon={<Filter className="w-4 h-4" />}>
            More Filters
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStartups.map((startup) => (
          <Card key={startup.id} className="hover:shadow-md transition-shadow group relative overflow-hidden">
            {/* Status Strip */}
            <div className={`absolute top-0 left-0 w-1 h-full ${
              startup.status === 'Green' ? 'bg-green-500' : 
              startup.status === 'Yellow' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />

            <CardContent className="p-6 pl-8">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <img src={startup.logo} alt={startup.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <h3 className="font-bold text-gray-900">{startup.name}</h3>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <MapPin className="w-3 h-3 mr-1" /> Bangalore
                      <span className="mx-2">•</span>
                      {startup.domain}
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Current Level</p>
                  <div className="flex items-center font-bold text-blue-600">
                    <Activity className="w-4 h-4 mr-1" /> AIRL {startup.airl}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Runway</p>
                  <div className="flex items-center font-bold text-gray-700">
                    <TrendingUp className="w-4 h-4 mr-1" /> {startup.runway}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Funding</span>
                  <span className="font-medium text-gray-900">{startup.funding}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Next Milestone</span>
                  <span className="font-medium text-gray-900 text-right truncate w-40">{startup.nextMilestone}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                <Button 
                  className="w-full group-hover:bg-blue-700" 
                  onClick={() => navigate(`/reviewer/portfolio/${startup.id}`)}
                >
                  View Full Profile <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </DashboardLayout>
  );
}
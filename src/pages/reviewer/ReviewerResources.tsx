import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { 
  FileText, 
  Download, 
  Search, 
  ExternalLink, 
  BookOpen, 
  Shield, 
  FileCheck,
  Video
} from 'lucide-react';

// --- Mock Resource Data ---

const categories = [
  { id: 'sops', label: 'SOPs & Guidelines', icon: BookOpen },
  { id: 'templates', label: 'Templates & Forms', icon: FileCheck },
  { id: 'compliance', label: 'Legal & Compliance', icon: Shield },
  { id: 'training', label: 'Training & Tutorials', icon: Video },
];

const resources = [
  { 
    id: 1, 
    title: 'TRL & AIRL Definitions Handbook (v2.0)', 
    category: 'sops', 
    type: 'PDF', 
    size: '2.4 MB', 
    updated: 'Oct 2023',
    description: 'The official guide to grading Technology Readiness Levels.'
  },
  { 
    id: 2, 
    title: 'Startup Onboarding Checklist', 
    category: 'sops', 
    type: 'XLSX', 
    size: '45 KB', 
    updated: 'Nov 2023',
    description: 'Step-by-step process for inducting new cohort members.'
  },
  { 
    id: 3, 
    title: 'Probation Warning Letter Template', 
    category: 'templates', 
    type: 'DOCX', 
    size: '120 KB', 
    updated: 'Jan 2023',
    description: 'Formal notice template for underperforming startups.'
  },
  { 
    id: 4, 
    title: 'Monthly Review Deck Template', 
    category: 'templates', 
    type: 'PPTX', 
    size: '5.6 MB', 
    updated: 'Aug 2023',
    description: 'Standard slides for founders to present progress.'
  },
  { 
    id: 5, 
    title: 'Grant Utilization Policy (DST)', 
    category: 'compliance', 
    type: 'PDF', 
    size: '1.2 MB', 
    updated: 'Mar 2023',
    description: 'Government guidelines on allowable grant expenses.'
  },
  { 
    id: 6, 
    title: 'How to Evaluate DeepTech IP', 
    category: 'training', 
    type: 'Video', 
    size: 'Link', 
    updated: 'Sep 2023',
    description: 'Training session recording by Dr. Rao.'
  },
];

export function ReviewerResources() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = resources.filter(r => {
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <DashboardLayout role="reviewer" title="Program Resources">
      
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input 
            className="pl-10" 
            placeholder="Search documents..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Button 
            variant={selectedCategory === 'all' ? 'primary' : 'outline'} 
            onClick={() => setSelectedCategory('all')}
            size="sm"
          >
            All
          </Button>
          {categories.map(cat => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'primary' : 'outline'}
              onClick={() => setSelectedCategory(cat.id)}
              size="sm"
              leftIcon={<cat.icon className="w-3 h-3" />}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${
                  item.type === 'PDF' ? 'bg-red-50 text-red-600' :
                  item.type === 'XLSX' ? 'bg-green-50 text-green-600' :
                  item.type === 'PPTX' ? 'bg-orange-50 text-orange-600' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  <FileText className="w-6 h-6" />
                </div>
                {item.type !== 'Video' ? (
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Download className="w-4 h-4 text-gray-500" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-4 h-4 text-gray-500" />
                  </Button>
                )}
              </div>
              
              <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[2.5rem]">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-500">
                <div className="flex gap-2">
                  <Badge variant="neutral">{item.type}</Badge>
                  {item.size !== 'Link' && <span>{item.size}</span>}
                </div>
                <span>Updated: {item.updated}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No resources found</h3>
          <p className="text-gray-500">Try adjusting your search or filter.</p>
        </div>
      )}

    </DashboardLayout>
  );
}
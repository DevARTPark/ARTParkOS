import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Card, CardContent } from "../../components/ui/Card";
import { Tabs } from "../../components/ui/Tabs";
import { PieChart, ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";
import { API_URL } from "../../config";

// Sub-Pages
import { ManageFundsSanctioned } from "./finance/ManageFundsSanctioned";
import { ManageFundsReceived } from "./finance/ManageFundsReceived";
import { ManageFundsAllocated } from "./finance/ManageFundsAllocated";
import { ViewFundsAvailable } from "./finance/ViewFundsAvailable";

export function ReviewerManageFinance() {
  const [activeTab, setActiveTab] = useState("overview");
  const [summary, setSummary] = useState({ sanctioned: 0, received: 0, allocated: 0, available: 0 });

  const fetchSummary = async () => {
    try {
      const res = await fetch(`${API_URL}/api/finance/summary`);
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      }
    } catch (err) { 
      console.error("Failed to fetch summary:", err); 
    }
  };

  // Initial Load
  useEffect(() => { 
    fetchSummary(); 
  }, []);

  // Callback to refresh summary when sub-components change data
  const handleDataChange = () => {
    fetchSummary();
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <DashboardLayout role="reviewer" title="Finance Management">
      
      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-l-4 border-l-blue-500 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-600 uppercase">Total Sanctioned</span>
              <PieChart className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(summary.sanctioned)}</div>
            <p className="text-xs text-gray-500 mt-1">Committed Funds</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-green-600 uppercase">Funds Received</span>
              <ArrowDownCircle className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(summary.received)}</div>
            <p className="text-xs text-gray-500 mt-1">Actual Inflow</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 bg-orange-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-orange-600 uppercase">Funds Allocated</span>
              <ArrowUpCircle className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(summary.allocated)}</div>
            <p className="text-xs text-gray-500 mt-1">Disbursed to Startups</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-purple-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-600 uppercase">Funds Available</span>
              <Wallet className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(summary.available)}</div>
            <p className="text-xs text-gray-500 mt-1">Remaining Purse</p>
          </CardContent>
        </Card>
      </div>

      {/* TABS & CONTENT */}
      <Tabs 
        tabs={[
          { id: "overview", label: "Overview & Available" },
          { id: "sanctioned", label: "Manage Sanctioned" },
          { id: "received", label: "Manage Received" },
          { id: "allocated", label: "Manage Allocated" },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="mt-6">
        {activeTab === 'overview' && <ViewFundsAvailable summary={summary} />}
        {/* Pass onUpdate to allow children to refresh the summary cards */}
        {activeTab === 'sanctioned' && <ManageFundsSanctioned onUpdate={handleDataChange} />}
        {activeTab === 'received' && <ManageFundsReceived onUpdate={handleDataChange} />}
        {activeTab === 'allocated' && <ManageFundsAllocated onUpdate={handleDataChange} />}
      </div>

    </DashboardLayout>
  );
}
import React from "react";
import { Card, CardContent } from "../../../components/ui/Card";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

export function ViewFundsAvailable({ summary }: { summary: any }) {
  const utilization = summary.received > 0 ? ((summary.allocated / summary.received) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
            <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Financial Health Snapshot</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="text-green-600 w-5 h-5"/>
                            <span className="font-medium text-gray-700">Total Inflow (Received)</span>
                        </div>
                        <span className="font-bold text-lg text-green-700">₹{summary.received.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <TrendingDown className="text-orange-600 w-5 h-5"/>
                            <span className="font-medium text-gray-700">Total Outflow (Allocated)</span>
                        </div>
                        <span className="font-bold text-lg text-orange-700">₹{summary.allocated.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-4 mt-2">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-xl text-gray-900">Net Available Purse</span>
                            <span className="font-bold text-2xl text-purple-700">₹{summary.available.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Fund Utilization</h3>
                <div className="flex flex-col items-center justify-center h-48">
                    <div className="relative w-32 h-32 rounded-full border-8 border-gray-100 flex items-center justify-center">
                        <div 
                            className="absolute inset-0 rounded-full border-8 border-blue-500" 
                            style={{ clipPath: `polygon(0 0, 100% 0, 100% ${utilization}%, 0 ${utilization}%)` }} // Simple visual hack, ideally use Recharts
                        ></div>
                        <span className="text-2xl font-bold text-blue-600">{utilization}%</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">of received funds have been allocated.</p>
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex gap-3 items-start">
         <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
         <div>
            <h4 className="font-bold text-yellow-800 text-sm">Note to Finance Head</h4>
            <p className="text-xs text-yellow-700 mt-1">
                Changes made in the tabs above (Sanctioned, Received, Allocated) are recorded immediately and will be visible on the CEO/Admin Dashboard. 
                Ensure all transaction IDs and Reference numbers are accurate for audit purposes.
            </p>
         </div>
      </div>
    </div>
  );
}
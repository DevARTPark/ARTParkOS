import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Trash2, Plus, Save } from "lucide-react";
import { API_URL } from "../../../config";

interface Props {
  onUpdate?: () => void;
}

export function ManageFundsAllocated({ onUpdate }: Props) {
  const [records, setRecords] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newRecord, setNewRecord] = useState({ 
      source: "DST", amount: "", date: "", description: "", beneficiary: "" 
  });

  useEffect(() => { fetchRecords(); }, []);

  const fetchRecords = async () => {
    try {
      const res = await fetch(`${API_URL}/api/finance/records?category=ALLOCATED`);
      if(res.ok) setRecords(await res.json());
    } catch(e) { console.error(e); }
  };

  const handleSave = async () => {
    if(!newRecord.amount || !newRecord.date || !newRecord.beneficiary) return alert("Required fields missing");
    
    try {
      const res = await fetch(`${API_URL}/api/finance/record`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newRecord, category: 'ALLOCATED' })
      });

      if (res.ok) {
        setNewRecord({ source: "DST", amount: "", date: "", description: "", beneficiary: "" });
        setIsAdding(false);
        await fetchRecords();
        if (onUpdate) onUpdate();
      }
    } catch(e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    if(confirm("Delete Allocation?")) {
      try {
        await fetch(`${API_URL}/api/finance/record/${id}`, { method: "DELETE" });
        await fetchRecords();
        if (onUpdate) onUpdate();
      } catch(e) { console.error(e); }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800">Funds Allocated (Outflow)</h2>
        <Button onClick={() => setIsAdding(!isAdding)} leftIcon={<Plus className="w-4 h-4"/>}>New Allocation</Button>
      </div>

      {isAdding && (
        <div className="bg-orange-50 p-4 rounded-lg mb-6 border border-orange-100 grid grid-cols-1 md:grid-cols-6 gap-4 items-end animate-in fade-in slide-in-from-top-2">
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-gray-500">Allocated To (Startup/Project)</label>
            <Input placeholder="Startup Name" value={newRecord.beneficiary} onChange={e => setNewRecord({...newRecord, beneficiary: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500">From Fund</label>
            <select className="w-full h-10 border rounded px-3 text-sm" value={newRecord.source} onChange={e => setNewRecord({...newRecord, source: e.target.value})}>
              <option value="DST">DST</option>
              <option value="GoK">GoK</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500">Amount (₹)</label>
            <Input type="number" value={newRecord.amount} onChange={e => setNewRecord({...newRecord, amount: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500">Date</label>
            <Input type="date" value={newRecord.date} onChange={e => setNewRecord({...newRecord, date: e.target.value})} />
          </div>
          <div className="flex gap-2">
             <Button className="w-full mb-0.5" variant="secondary" onClick={handleSave}><Save className="w-4 h-4"/></Button>
          </div>
        </div>
      )}

      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Beneficiary</th>
            <th className="px-4 py-3">Source Fund</th>
            <th className="px-4 py-3 text-right">Amount Allocated</th>
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {records.length > 0 ? records.map(r => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">{new Date(r.date).toLocaleDateString()}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{r.beneficiary}</td>
              <td className="px-4 py-3 text-xs text-gray-500">{r.source}</td>
              <td className="px-4 py-3 text-right font-mono font-bold text-orange-600">- ₹{r.amount.toLocaleString()}</td>
              <td className="px-4 py-3 text-center">
                <button onClick={() => handleDelete(r.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan={5} className="text-center py-4 text-gray-400">No allocations found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
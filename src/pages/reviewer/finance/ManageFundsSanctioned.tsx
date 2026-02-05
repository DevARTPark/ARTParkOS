import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Trash2, Plus, Save } from "lucide-react";
import { API_URL } from "../../../config";

interface Props {
  onUpdate?: () => void;
}

export function ManageFundsSanctioned({ onUpdate }: Props) {
  const [records, setRecords] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newRecord, setNewRecord] = useState({ source: "DST", amount: "", date: "", description: "" });

  useEffect(() => { fetchRecords(); }, []);

  const fetchRecords = async () => {
    try {
      const res = await fetch(`${API_URL}/api/finance/records?category=SANCTIONED`);
      if(res.ok) setRecords(await res.json());
    } catch(e) { console.error(e); }
  };

  const handleSave = async () => {
    if(!newRecord.amount || !newRecord.date) return alert("Amount and Date required");
    
    try {
      const res = await fetch(`${API_URL}/api/finance/record`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newRecord, category: 'SANCTIONED' })
      });

      if (res.ok) {
        setNewRecord({ source: "DST", amount: "", date: "", description: "" });
        setIsAdding(false);
        // 1. Refresh Local List
        await fetchRecords();
        // 2. Refresh Parent Summary
        if (onUpdate) onUpdate();
      } else {
        alert("Failed to save record");
      }
    } catch(e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    if(confirm("Delete this record?")) {
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
        <h2 className="text-lg font-bold text-gray-800">Sanctioned Funds (Commitments)</h2>
        <Button onClick={() => setIsAdding(!isAdding)} leftIcon={<Plus className="w-4 h-4"/>}>Add Sanction</Button>
      </div>

      {isAdding && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-blue-100 grid grid-cols-1 md:grid-cols-5 gap-4 items-end animate-in fade-in slide-in-from-top-2">
          <div>
            <label className="text-xs font-bold text-gray-500">Source</label>
            <select 
              className="w-full h-10 border rounded px-3 text-sm"
              value={newRecord.source}
              onChange={e => setNewRecord({...newRecord, source: e.target.value})}
            >
              <option value="DST">DST</option>
              <option value="GoK">GoK</option>
              <option value="Private">Private</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500">Amount (₹)</label>
            <Input type="number" placeholder="0.00" value={newRecord.amount} onChange={e => setNewRecord({...newRecord, amount: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500">Date</label>
            <Input type="date" value={newRecord.date} onChange={e => setNewRecord({...newRecord, date: e.target.value})} />
          </div>
          <div className="md:col-span-2 flex gap-2">
             <div className="flex-1">
                <label className="text-xs font-bold text-gray-500">Sanction Letter / Description</label>
                <Input placeholder="Ref # or Description" value={newRecord.description} onChange={e => setNewRecord({...newRecord, description: e.target.value})} />
             </div>
             <Button className="mb-0.5" onClick={handleSave}><Save className="w-4 h-4"/></Button>
          </div>
        </div>
      )}

      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3 text-right">Amount</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {records.length > 0 ? records.map(r => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">{new Date(r.date).toLocaleDateString()}</td>
              <td className="px-4 py-3"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">{r.source}</span></td>
              <td className="px-4 py-3">{r.description || "-"}</td>
              <td className="px-4 py-3 text-right font-mono font-bold">₹{r.amount.toLocaleString()}</td>
              <td className="px-4 py-3 text-center">
                <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 className="w-4 h-4"/></button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan={5} className="text-center py-4 text-gray-400">No records found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
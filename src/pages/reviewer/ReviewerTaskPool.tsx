// devartpark/artparkos/ARTParkOS-63174fefa53fa8fd4c24024cabab26998aa0c79a/src/pages/reviewer/ReviewerTaskPool.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import {
  ClipboardList, Search, Filter, Clock, ArrowDownToLine, CheckCircle2, AlertCircle, X, Loader2, FileText
} from "lucide-react";
import { API_URL } from "../../config";

const getUser = () => JSON.parse(localStorage.getItem("artpark_user") || "{}");

export function ReviewerTaskPool() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/reviewer/pool`);
      if (res.ok) setTasks(await res.json());
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleAcceptTask = async (task: any) => {
    const user = getUser();
    if (!user.id) return alert("Please log in.");

    try {
      const res = await fetch(`${API_URL}/api/reviewer/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Pass the KIND so backend knows which table to update
        body: JSON.stringify({ submissionId: task.originId, reviewerId: user.id, kind: task.kind }),
      });

      if (res.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== task.id));
        navigate("/reviewer/tasks");
      } else { alert("Failed to assign."); }
    } catch (err) { alert("Error assigning task."); }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = (task.startup || "").toLowerCase().includes(search.toLowerCase()) || (task.title || "").toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "All" || task.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <DashboardLayout role="reviewer" title="Task Pool">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-blue-900">Review Queue</h4>
          <p className="text-xs text-blue-700 mt-1">Claim tasks to start reviewing.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-4 py-2 w-full bg-white border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <Button size="sm" variant="outline" onClick={fetchTasks}>Refresh</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-gray-400"/></div> : 
         filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <Card key={task.id} className="hover:border-blue-300 border-l-4 border-l-transparent hover:border-l-blue-500">
              <CardContent className="p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-lg border shadow-sm bg-white">
                    {task.type.includes("Report") ? <FileText className="w-6 h-6 text-purple-500"/> : <ClipboardList className="w-6 h-6 text-blue-500"/>}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      <Badge variant={task.priority==="High"?"danger":"neutral"}>{task.priority}</Badge>
                      <Badge variant="outline">{task.type}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span className="font-medium text-slate-700">{task.startup}</span>
                      <span>•</span>
                      <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> Submitted: {new Date(task.submittedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <Button onClick={() => handleAcceptTask(task)} className="bg-blue-600 text-white min-w-[140px]">
                  <ArrowDownToLine className="w-4 h-4 mr-2" /> Accept
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 border border-dashed rounded-lg"><h3 className="text-gray-900">No tasks found</h3></div>
        )}
      </div>
    </DashboardLayout>
  );
}
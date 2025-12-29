import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import {
  ClipboardList,
  Search,
  Filter,
  Clock,
  ArrowDownToLine,
  CheckCircle2,
  AlertCircle,
  X,
  Eye,
  Lock,
  Loader2,
} from "lucide-react";
import { API_URL } from "../../config"; // Ensure this is imported

// Helper to get user ID
const getUser = () => JSON.parse(localStorage.getItem("artpark_user") || "{}");

export function ReviewerTaskPool() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- FILTER STATES ---
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // 1. LOAD TASKS FROM API
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/reviewer/pool`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error("Failed to load pool:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTask = async (taskId: string) => {
    const user = getUser();
    if (!user.id) return alert("You must be logged in.");

    try {
      const res = await fetch(`${API_URL}/api/reviewer/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: taskId, reviewerId: user.id }),
      });

      if (res.ok) {
        // Remove from local list immediately for UI responsiveness
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        navigate("/reviewer/tasks");
      } else {
        alert("Failed to assign task.");
      }
    } catch (err) {
      alert("Error assigning task.");
    }
  };

  const handleViewTask = (taskId: string) => {
    navigate(`/reviewer/review/${taskId}`, { state: { readOnly: true } });
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      (task.startup || "").toLowerCase().includes(search.toLowerCase()) ||
      (task.title || "").toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "All" || task.type === typeFilter;
    const matchesPriority =
      priorityFilter === "All" || task.priority === priorityFilter;
    return matchesSearch && matchesType && matchesPriority;
  });

  return (
    <DashboardLayout role="reviewer" title="Task Pool (Open Queue)">
      {/* Header Info */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-blue-900">How this works</h4>
          <p className="text-xs text-blue-700 mt-1">
            Tasks in <strong>white</strong> are open for assignment. Claim a
            task to start reviewing.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-full bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={showFilters ? "secondary" : "outline"}
              size="sm"
              leftIcon={
                showFilters ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Filter className="w-4 h-4" />
                )
              }
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Close Filters" : "Filter"}
            </Button>
            <Button size="sm" variant="outline" onClick={fetchTasks}>
              Refresh
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">
                Task Type
              </label>
              <select
                className="w-full text-sm border-gray-200 rounded-md p-1.5"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="AIRL Assessment">AIRL Assessment</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
          </div>
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <Card
              key={task.id}
              className="bg-white hover:border-blue-300 transition-colors border-l-4 border-l-transparent hover:border-l-blue-500"
            >
              <CardContent className="p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Left: Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-lg border shadow-sm bg-white border-gray-100">
                    <ClipboardList className="w-6 h-6 text-slate-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {task.title}
                      </h3>
                      <Badge variant="neutral">{task.priority} Priority</Badge>
                      <Badge variant="outline" className="text-xs">
                        {task.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Project: {task.project}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="font-medium text-slate-700">
                        {task.startup}
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" /> Submitted:{" "}
                        {new Date(task.submittedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Action */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Button
                    onClick={() => handleAcceptTask(task.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]"
                  >
                    <ArrowDownToLine className="w-4 h-4 mr-2" />
                    Accept Task
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
            <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <h3 className="text-gray-900 font-medium">No tasks found</h3>
            <p className="text-gray-500 text-sm">
              The pool is empty right now.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input, Textarea } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Badge } from "../../components/ui/Badge";
import {
  Plus,
  Trash2,
  Save,
  Layers,
  AlertCircle,
  MessageSquare,
  Lightbulb,
  Check,
  Loader2,
  Edit2,
  X,
  Settings,
  AlertTriangle,
} from "lucide-react";
import Modal from "../../components/ui/Modal";
import { API_URL } from "../../config";

export function ReviewerAssessmentConfig() {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- 1. STATE MANAGEMENT ---

  // Categories (Fetched from API)
  const [categories, setCategories] = useState<string[]>([]);

  // Questions (Fetched from API)
  const [questions, setQuestions] = useState<any[]>([]);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    text: "",
    category: "",
    commentPrompt: "Founder's Comments",
    expectations: "",
    isCritical: true,
    scope: "project",
  });

  // Category Manager State
  const [showCatManager, setShowCatManager] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteInput, setDeleteInput] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [editingCat, setEditingCat] = useState<{
    old: string;
    new: string;
  } | null>(null);

  // --- 2. LOAD DATA FROM BACKEND ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [catsRes, qsRes] = await Promise.all([
          fetch(`${API_URL}/api/assessment/categories`),
          fetch(`${API_URL}/api/assessment/questions`),
        ]);

        if (catsRes.ok && qsRes.ok) {
          const catsData = await catsRes.json();
          // API returns objects {id, name}, we map to strings for UI
          setCategories(catsData.map((c: any) => c.name));

          const qsData = await qsRes.json();
          setQuestions(
            qsData.map((q: any) => ({
              ...q,
              // Ensure default flags exist
              isCritical: q.isCritical !== undefined ? q.isCritical : true,
              scope: q.scope || "project",
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load config:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- 3. COMPUTED DATA ---

  const visibleCategories = categories.filter((c) => c !== "Uncategorized");

  const currentLevelQuestions = questions.filter(
    (q: any) => q.airlLevel === selectedLevel
  );

  // Initialize Form Category
  useEffect(() => {
    if (!formData.category && visibleCategories.length > 0) {
      setFormData((prev) => ({ ...prev, category: visibleCategories[0] }));
    }
  }, [visibleCategories]);

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      text: "",
      category: visibleCategories[0] || "",
      commentPrompt: "Founder's Comments",
      expectations: "",
      isCritical: true,
      scope: "project",
    });
  };

  // --- 4. QUESTION HANDLERS (API CONNECTED) ---

  const handleAddOrUpdateQuestion = async () => {
    if (!formData.text.trim()) return;

    const expectationsArray = formData.expectations
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const payload = {
      id: editingId, // If ID exists, backend updates; else creates
      airlLevel: selectedLevel,
      ...formData,
      expectations: expectationsArray,
    };

    try {
      const res = await fetch(`${API_URL}/api/assessment/questions`, {
        method: "POST", // We use POST for both create and update (upsert logic in backend)
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const savedQ = await res.json();

        if (editingId) {
          // Update local state
          setQuestions(
            questions.map((q: any) => (q.id === editingId ? savedQ : q))
          );
          setEditingId(null);
        } else {
          // Add to local state
          setQuestions([...questions, savedQ]);
        }
        resetForm();
      } else {
        throw new Error("Failed to save");
      }
    } catch (err) {
      alert("Error saving question to backend.");
    }
  };

  const handleEditClick = (q: any) => {
    setEditingId(q.id);
    setFormData({
      text: q.text,
      category: q.category,
      commentPrompt: q.commentPrompt || "Founder's Comments",
      expectations: q.expectations ? q.expectations.join("\n") : "",
      isCritical: q.isCritical !== undefined ? q.isCritical : true,
      scope: q.scope || "project",
    });

    if (q.airlLevel !== selectedLevel) setSelectedLevel(q.airlLevel);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteQuestion = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await fetch(`${API_URL}/api/assessment/questions/${id}`, {
          method: "DELETE",
        });
        setQuestions(questions.filter((q: any) => q.id !== id));
        if (editingId === id) resetForm();
      } catch (err) {
        alert("Failed to delete question.");
      }
    }
  };

  // --- 5. CATEGORY HANDLERS (API CONNECTED) ---

  const handleAddCategory = async () => {
    const trimmed = newCatName.trim();
    if (trimmed && !categories.includes(trimmed)) {
      try {
        const res = await fetch(`${API_URL}/api/assessment/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: trimmed }),
        });

        if (res.ok) {
          setCategories([...categories, trimmed]);
          setNewCatName("");
        }
      } catch (err) {
        alert("Failed to add category.");
      }
    }
  };

  const handleRenameCategory = async () => {
    if (!editingCat || !editingCat.new.trim()) return;
    const oldName = editingCat.old;
    const newName = editingCat.new.trim();

    try {
      const res = await fetch(`${API_URL}/api/assessment/categories`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldName, newName }),
      });

      if (res.ok) {
        // Update Categories List
        const updatedCats = categories.map((c) =>
          c === oldName ? newName : c
        );
        setCategories(updatedCats);

        // Update Questions that used this category
        const updatedQuestions = questions.map((q: any) =>
          q.category === oldName ? { ...q, category: newName } : q
        );
        setQuestions(updatedQuestions);
        setEditingCat(null);
      }
    } catch (err) {
      alert("Failed to rename category.");
    }
  };

  const initiateDeleteCategory = (cat: string) => {
    setDeleteTarget(cat);
    setDeleteInput("");
  };

  const executeDeleteCategory = async () => {
    if (!deleteTarget || deleteInput !== deleteTarget) return;

    try {
      const res = await fetch(
        `${API_URL}/api/assessment/categories/${deleteTarget}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        // Update Questions (Move to Uncategorized)
        const updatedQuestions = questions.map((q: any) =>
          q.category === deleteTarget
            ? { ...q, category: "Uncategorized", legacyCategory: deleteTarget }
            : q
        );
        setQuestions(updatedQuestions);

        // Remove Category
        const updatedCats = categories.filter((c) => c !== deleteTarget);
        setCategories(updatedCats);
      }
    } catch (err) {
      alert("Failed to delete category.");
    }

    setDeleteTarget(null);
  };

  // --- 6. SAVE GLOBAL (Visual Only) ---
  // Since we are now saving immediately on Add/Update, this button is less critical
  // but good for user reassurance.
  const handleSaveGlobal = () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setTimeout(() => {
      setSaveSuccess(true);
      setIsSaving(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  if (isLoading) {
    return (
      <DashboardLayout role="reviewer" title="AIRL Framework Configuration">
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-500">Loading Configuration...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="reviewer" title="AIRL Framework Configuration">
      {/* Level Selector Toolbar */}
      <div className="flex justify-between items-end mb-6">
        <div className="flex overflow-x-auto pb-4 gap-2 mb-2 no-scrollbar flex-1 mr-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`flex flex-col items-center justify-center min-w-[80px] h-20 rounded-xl border-2 transition-all ${
                selectedLevel === level
                  ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                  : "border-slate-200 bg-white text-slate-500 hover:border-blue-300"
              }`}
            >
              <span className="text-xs font-semibold uppercase tracking-wider">
                Level
              </span>
              <span className="text-3xl font-bold">{level}</span>
            </button>
          ))}
        </div>
        <Button
          variant="outline"
          onClick={() => setShowCatManager(true)}
          className="mb-6 h-10"
        >
          <Settings className="w-4 h-4 mr-2" /> Categories
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* --- LEFT: QUESTION LIST --- */}
        <div className="flex-1 space-y-6">
          {visibleCategories.map((category) => {
            const categoryQuestions = currentLevelQuestions.filter(
              (q: any) => q.category === category
            );

            return (
              <Card key={category}>
                <CardHeader className="py-4 bg-slate-50 border-b border-slate-100">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center">
                      <Layers className="w-4 h-4 mr-2 text-slate-400" />
                      {category}
                    </h3>
                    <Badge variant="neutral">
                      {categoryQuestions.length} Questions
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {categoryQuestions.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-sm italic">
                      No questions defined for this category at Level{" "}
                      {selectedLevel}.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {categoryQuestions.map((q: any) => (
                        <div
                          key={q.id}
                          className={`p-4 group hover:bg-slate-50 transition-colors ${
                            editingId === q.id
                              ? "bg-blue-50 border-l-4 border-l-blue-500"
                              : ""
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <p className="text-sm text-slate-700 font-medium w-5/6">
                              {q.text}
                              {q.isCritical && (
                                <span
                                  className="text-red-500 font-bold ml-1"
                                  title="Compulsory Question"
                                >
                                  *
                                </span>
                              )}
                            </p>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEditClick(q)}
                                className="text-slate-300 hover:text-blue-500 transition-colors p-1"
                                title="Edit Question"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteQuestion(q.id)}
                                className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                title="Remove Question"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2 items-center">
                            {/* Label Badge */}
                            <div className="flex items-center text-xs text-slate-500 bg-white border border-slate-100 rounded px-2 py-1">
                              <MessageSquare className="w-3 h-3 mr-1.5 text-blue-400" />
                              <span className="font-medium text-slate-700">
                                {q.commentPrompt || "Founder's Comments"}
                              </span>
                            </div>

                            {/* Expectations Section */}
                            {q.expectations && q.expectations.length > 0 && (
                              <div className="flex-1 min-w-[200px] text-xs text-slate-600 bg-blue-50/50 border border-blue-100 rounded p-2">
                                <div className="flex items-center gap-1 font-semibold text-blue-700 mb-1">
                                  <Lightbulb className="w-3 h-3" /> Expectations
                                  ({q.expectations.length}):
                                </div>
                                <ul className="list-disc list-inside text-slate-500 pl-1">
                                  {q.expectations.map(
                                    (exp: string, i: number) => (
                                      <li key={i} className="truncate">
                                        {exp}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* --- RIGHT: FORM EDITOR --- */}
        <div className="w-full lg:w-96">
          <Card
            className={`sticky top-24 shadow-md transition-all ${
              editingId
                ? "border-blue-400 ring-4 ring-blue-50"
                : "border-blue-200"
            }`}
          >
            <CardHeader
              className={`${
                editingId ? "bg-blue-100" : "bg-blue-50"
              } border-b border-blue-100`}
            >
              <div className="flex justify-between items-center">
                <CardTitle className="text-blue-800">
                  {editingId ? "Edit Question" : "Add New Question"}
                </CardTitle>
                {editingId && (
                  <button
                    onClick={resetForm}
                    className="text-blue-600 hover:text-blue-800"
                    title="Cancel Edit"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div
                className={`p-3 rounded-lg flex items-start gap-3 text-sm mb-2 ${
                  editingId
                    ? "bg-white border border-blue-200 text-blue-800"
                    : "bg-blue-50 text-blue-700"
                }`}
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>
                  {editingId
                    ? "Editing an existing question."
                    : `Adding to AIRL Level ${selectedLevel}.`}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category
                </label>
                <Select
                  options={visibleCategories.map((c) => ({
                    value: c,
                    label: c,
                  }))}
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Question Text
                </label>
                <Textarea
                  rows={3}
                  placeholder="e.g., Has the MVP been tested with 10+ users?"
                  value={formData.text}
                  onChange={(e) =>
                    setFormData({ ...formData, text: e.target.value })
                  }
                />
              </div>

              {/* TOGGLES ROW */}
              <div className="space-y-3 pt-2">
                {/* 1. Compulsory Toggle */}
                <div
                  className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 cursor-pointer"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      isCritical: !formData.isCritical,
                    })
                  }
                >
                  <div>
                    <span className="block text-xs font-bold text-slate-700">
                      Compulsory Question
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Must be met to pass level
                    </span>
                  </div>
                  <div
                    className={`w-8 h-4 rounded-full p-0.5 transition-colors ${
                      formData.isCritical ? "bg-red-500" : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${
                        formData.isCritical ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </div>
                </div>

                {/* 2. Scope Toggle */}
                <div
                  className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 cursor-pointer"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      scope:
                        formData.scope === "project" ? "company" : "project",
                    })
                  }
                >
                  <div>
                    <span className="block text-xs font-bold text-slate-700">
                      Company Level?
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Answer applies to all projects
                    </span>
                  </div>
                  <div
                    className={`w-8 h-4 rounded-full p-0.5 transition-colors ${
                      formData.scope === "company"
                        ? "bg-purple-600"
                        : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${
                        formData.scope === "company"
                          ? "translate-x-4"
                          : "translate-x-0"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Expectations
                </label>
                <Textarea
                  rows={4}
                  placeholder="- Point 1\n- Point 2"
                  value={formData.expectations}
                  onChange={(e) =>
                    setFormData({ ...formData, expectations: e.target.value })
                  }
                  className="font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Comment Label
                </label>
                <Input
                  value={formData.commentPrompt}
                  onChange={(e) =>
                    setFormData({ ...formData, commentPrompt: e.target.value })
                  }
                  placeholder="Default: Founder's Comments"
                />
              </div>

              <div className="flex gap-2">
                {editingId && (
                  <Button
                    onClick={resetForm}
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  onClick={handleAddOrUpdateQuestion}
                  className={`flex-1 ${
                    editingId ? "bg-blue-700 hover:bg-blue-800" : ""
                  }`}
                  leftIcon={
                    editingId ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )
                  }
                >
                  {editingId ? "Update" : "Add Question"}
                </Button>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-4">
                <Button
                  onClick={handleSaveGlobal}
                  disabled={isSaving}
                  variant={saveSuccess ? "default" : "outline"}
                  className={`w-full transition-all ${
                    saveSuccess
                      ? "bg-green-600 hover:bg-green-700 border-green-600 text-white"
                      : ""
                  }`}
                  leftIcon={
                    isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : saveSuccess ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )
                  }
                >
                  {isSaving
                    ? "Saving..."
                    : saveSuccess
                    ? "Saved Globally!"
                    : "Save Changes Globally"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* --- CATEGORY MANAGER MODAL --- */}
      <Modal
        isOpen={showCatManager}
        onClose={() => setShowCatManager(false)}
        title="Manage Categories"
        size="md"
      >
        <div className="space-y-6">
          <div className="flex gap-2">
            <Input
              placeholder="New Category Name..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
            />
            <Button onClick={handleAddCategory} disabled={!newCatName.trim()}>
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto border border-slate-100 rounded-lg p-2">
            {visibleCategories.map((cat) => (
              <div
                key={cat}
                className="flex items-center justify-between p-2 hover:bg-slate-50 rounded group"
              >
                {editingCat?.old === cat ? (
                  <div className="flex gap-2 flex-1 mr-2">
                    <Input
                      value={editingCat.new}
                      onChange={(e) =>
                        setEditingCat({ ...editingCat, new: e.target.value })
                      }
                      className="h-8 text-sm"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={handleRenameCategory}
                      className="h-8 w-8 p-0"
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setEditingCat(null)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <span className="text-sm text-slate-700">{cat}</span>
                )}

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingCat({ old: cat, new: cat })}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                    title="Rename"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => initiateDeleteCategory(cat)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button
              variant="secondary"
              onClick={() => setShowCatManager(false)}
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <div className="bg-red-50 text-red-800 p-3 rounded-lg text-sm border border-red-100">
            <p className="font-bold flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4" /> Warning
            </p>
            <p>
              This will hide the category <strong>"{deleteTarget}"</strong> and
              move its questions to "Uncategorized". This action cannot be
              undone.
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Type <strong>{deleteTarget}</strong> below to confirm:
            </label>
            <Input
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder={deleteTarget || ""}
              className="border-red-200 focus:ring-red-500 placeholder:text-gray-300"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              onClick={executeDeleteCategory}
              disabled={deleteInput !== deleteTarget}
              className={`text-white transition-all ${
                deleteInput === deleteTarget
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Delete Category
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

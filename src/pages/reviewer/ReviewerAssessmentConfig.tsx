import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { airlQuestions as defaultQuestions } from '../../data/mockData';
import { 
  Plus, Trash2, Save, Layers, AlertCircle, MessageSquare, 
  Lightbulb, Check, Loader2, Edit2, X 
} from 'lucide-react';

const CATEGORIES = [
  'Technology',
  'Product Engineering',
  'Market Research',
  'Organization Structure',
  'Target Market Engagement'
];

export function ReviewerAssessmentConfig() {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 1. INITIALIZE FROM LOCAL STORAGE
  const [questions, setQuestions] = useState(() => {
    const savedConfig = localStorage.getItem('airl_framework_config');
    return savedConfig ? JSON.parse(savedConfig) : defaultQuestions;
  });
  
  // State for form inputs
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionCategory, setNewQuestionCategory] = useState(CATEGORIES[0]);
  const [newCommentPrompt, setNewCommentPrompt] = useState("Founder's Comments");
  const [newExpectations, setNewExpectations] = useState('');

  // EDIT MODE STATE
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filter questions for current view
  const currentLevelQuestions = questions.filter((q: any) => q.airlLevel === selectedLevel);

  // --- Handlers ---

  const handleAddOrUpdateQuestion = () => {
    if (!newQuestionText.trim()) return;

    const expectationsArray = newExpectations
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (editingId) {
      // UPDATE EXISTING
      setQuestions(questions.map((q: any) => 
        q.id === editingId 
          ? { 
              ...q, 
              text: newQuestionText, 
              category: newQuestionCategory,
              commentPrompt: newCommentPrompt,
              expectations: expectationsArray 
            } 
          : q
      ));
      setEditingId(null); // Exit edit mode
    } else {
      // CREATE NEW
      const newQ = {
        id: `q-${Date.now()}`,
        airlLevel: selectedLevel,
        category: newQuestionCategory,
        text: newQuestionText,
        commentPrompt: newCommentPrompt.trim() || "Founder's Comments",
        expectations: expectationsArray,
        required: true
      };
      setQuestions([...questions, newQ]);
    }
    
    // Reset inputs
    resetForm();
  };

  const handleEditClick = (q: any) => {
    setEditingId(q.id);
    setNewQuestionText(q.text);
    setNewQuestionCategory(q.category);
    setNewCommentPrompt(q.commentPrompt || "Founder's Comments");
    setNewExpectations(q.expectations ? q.expectations.join('\n') : '');
    
    // If editing a question from a different level, switch view to that level
    if (q.airlLevel !== selectedLevel) {
      setSelectedLevel(q.airlLevel);
    }
    
    // Scroll to form (UX improvement)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteQuestion = (id: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      setQuestions(questions.filter((q: any) => q.id !== id));
      if (editingId === id) resetForm(); // Cancel edit if deleting the active item
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setNewQuestionText('');
    setNewQuestionCategory(CATEGORIES[0]);
    setNewCommentPrompt("Founder's Comments");
    setNewExpectations('');
  };

  const handleSaveGlobal = () => {
    setIsSaving(true);
    setSaveSuccess(false);

    setTimeout(() => {
      try {
        localStorage.setItem('airl_framework_config', JSON.stringify(questions));
        setSaveSuccess(true);
        window.dispatchEvent(new Event("storage"));
      } catch (err) {
        console.error("Failed to save config:", err);
        alert("Failed to save configuration.");
      } finally {
        setIsSaving(false);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    }, 800);
  };

  return (
    <DashboardLayout role="reviewer" title="AIRL Framework Configuration">
      
      {/* Level Selector Toolbar */}
      <div className="flex overflow-x-auto pb-4 gap-2 mb-6 no-scrollbar">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
          <button
            key={level}
            onClick={() => setSelectedLevel(level)}
            className={`flex flex-col items-center justify-center min-w-[80px] h-20 rounded-xl border-2 transition-all ${
              selectedLevel === level
                ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                : 'border-slate-200 bg-white text-slate-500 hover:border-blue-300'
            }`}
          >
            <span className="text-xs font-semibold uppercase tracking-wider">Level</span>
            <span className="text-3xl font-bold">{level}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Question List by Category */}
        <div className="flex-1 space-y-6">
          {CATEGORIES.map((category) => {
            const categoryQuestions = currentLevelQuestions.filter((q: any) => q.category === category);
            
            return (
              <Card key={category}>
                <CardHeader className="py-4 bg-slate-50 border-b border-slate-100">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center">
                      <Layers className="w-4 h-4 mr-2 text-slate-400" />
                      {category}
                    </h3>
                    <Badge variant="neutral">{categoryQuestions.length} Questions</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {categoryQuestions.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-sm italic">
                      No questions defined for this category at Level {selectedLevel}.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {categoryQuestions.map((q: any) => (
                        <div 
                          key={q.id} 
                          className={`p-4 group hover:bg-slate-50 transition-colors ${editingId === q.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                        >
                          <div className="flex items-start justify-between">
                            <p className="text-sm text-slate-700 font-medium w-5/6">
                              {q.text}
                            </p>
                            <div className="flex items-center gap-1">
                              {/* Edit Button */}
                              <button 
                                onClick={() => handleEditClick(q)}
                                className="text-slate-300 hover:text-blue-500 transition-colors p-1"
                                title="Edit Question"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              {/* Delete Button */}
                              <button 
                                onClick={() => handleDeleteQuestion(q.id)}
                                className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                title="Remove Question"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex flex-wrap gap-2">
                            <div className="flex items-center text-xs text-slate-500 bg-white border border-slate-100 rounded px-2 py-1">
                              <MessageSquare className="w-3 h-3 mr-1.5 text-blue-400" />
                              Label: <span className="font-medium ml-1 text-slate-700">{q.commentPrompt || "Founder's Comments"}</span>
                            </div>

                            {q.expectations && q.expectations.length > 0 && (
                              <div className="flex-1 min-w-[200px] text-xs text-slate-600 bg-blue-50/50 border border-blue-100 rounded p-2">
                                <div className="flex items-center gap-1 font-semibold text-blue-700 mb-1">
                                  <Lightbulb className="w-3 h-3" /> Expectations ({q.expectations.length}):
                                </div>
                                <ul className="list-disc list-inside text-slate-500 pl-1">
                                  {q.expectations.map((exp: string, i: number) => (
                                    <li key={i} className="truncate">{exp}</li>
                                  ))}
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

        {/* Right Column: Add/Edit Form */}
        <div className="w-full lg:w-96">
          <Card className={`sticky top-24 shadow-md transition-all ${editingId ? 'border-blue-400 ring-4 ring-blue-50' : 'border-blue-200'}`}>
            <CardHeader className={`${editingId ? 'bg-blue-100' : 'bg-blue-50'} border-b border-blue-100`}>
              <div className="flex justify-between items-center">
                <CardTitle className="text-blue-800">
                  {editingId ? 'Edit Question' : 'Add New Question'}
                </CardTitle>
                {editingId && (
                  <button onClick={resetForm} className="text-blue-600 hover:text-blue-800" title="Cancel Edit">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className={`p-3 rounded-lg flex items-start gap-3 text-sm mb-2 ${editingId ? 'bg-white border border-blue-200 text-blue-800' : 'bg-blue-50 text-blue-700'}`}>
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>
                  {editingId ? 'Editing an existing question.' : `Adding to AIRL Level ${selectedLevel}.`}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <Select 
                  options={CATEGORIES.map(c => ({ value: c, label: c }))}
                  value={newQuestionCategory}
                  onChange={(e) => setNewQuestionCategory(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Question Text</label>
                <Textarea 
                  rows={3}
                  placeholder="e.g., Has the MVP been tested with 10+ users?"
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Expectations / Guidance</label>
                <p className="text-[10px] text-slate-500 mb-1.5">Enter points line-by-line.</p>
                <Textarea 
                  rows={5}
                  placeholder={"- Cite specific papers\n- Demonstrate understanding"}
                  value={newExpectations}
                  onChange={(e) => setNewExpectations(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Comment Box Label</label>
                <Input 
                  value={newCommentPrompt}
                  onChange={(e) => setNewCommentPrompt(e.target.value)}
                  placeholder="Default: Founder's Comments"
                />
              </div>

              <div className="flex gap-2">
                {editingId && (
                  <Button onClick={resetForm} variant="secondary" className="flex-1">
                    Cancel
                  </Button>
                )}
                <Button 
                  onClick={handleAddOrUpdateQuestion} 
                  className={`flex-1 ${editingId ? 'bg-blue-700 hover:bg-blue-800' : ''}`} 
                  leftIcon={editingId ? <Check className="w-4 h-4"/> : <Plus className="w-4 h-4" />}
                >
                  {editingId ? 'Update Question' : 'Add to Framework'}
                </Button>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-4">
                <Button 
                  onClick={handleSaveGlobal} 
                  disabled={isSaving}
                  variant={saveSuccess ? 'default' : 'outline'}
                  className={`w-full transition-all ${saveSuccess ? 'bg-green-600 hover:bg-green-700 border-green-600 text-white' : ''}`}
                  leftIcon={isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : saveSuccess ? <Check className="w-4 h-4"/> : <Save className="w-4 h-4" />}
                >
                  {isSaving ? 'Saving Changes...' : saveSuccess ? 'Saved Globally!' : 'Save Changes Globally'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  );
}
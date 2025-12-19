import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { airlQuestions } from '../../data/mockData'; // Initial data
import { Plus, Trash2, Save, Layers, AlertCircle, MessageSquare, Lightbulb } from 'lucide-react';

// Define the 5 Categories
const CATEGORIES = [
  'Technology',
  'Product Engineering',
  'Market Research',
  'Organization Structure',
  'Target Market Engagement'
];

export function ReviewerAssessmentConfig() {
  const [selectedLevel, setSelectedLevel] = useState(1);
  // Local state to simulate database of questions
  const [questions, setQuestions] = useState(airlQuestions);
  
  // State for new question form
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionCategory, setNewQuestionCategory] = useState(CATEGORIES[0]);
  
  // State for custom comment prompt
  const [newCommentPrompt, setNewCommentPrompt] = useState("Founder's Comments");

  // NEW: State for Expectations/Guidance
  const [newExpectations, setNewExpectations] = useState('');

  // Filter questions for current view
  const currentLevelQuestions = questions.filter(q => q.airlLevel === selectedLevel);

  const handleAddQuestion = () => {
    if (!newQuestionText.trim()) return;

    // Convert the textarea string into an array of strings (one per line)
    const expectationsArray = newExpectations
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const newQ = {
      id: `q-${Date.now()}`,
      airlLevel: selectedLevel,
      category: newQuestionCategory,
      text: newQuestionText,
      commentPrompt: newCommentPrompt.trim() || "Founder's Comments",
      expectations: expectationsArray, // Add the array to the question object
      required: true
    };

    setQuestions([...questions, newQ]);
    
    // Reset inputs
    setNewQuestionText('');
    setNewCommentPrompt("Founder's Comments");
    setNewExpectations('');
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
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
            const categoryQuestions = currentLevelQuestions.filter(q => q.category === category);
            
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
                        <div key={q.id} className="p-4 group hover:bg-slate-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <p className="text-sm text-slate-700 font-medium w-5/6">
                              {q.text}
                            </p>
                            <button 
                              onClick={() => handleDeleteQuestion(q.id)}
                              className="text-slate-300 hover:text-red-500 transition-colors p-1"
                              title="Remove Question"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="mt-3 flex flex-wrap gap-2">
                            {/* Comment Prompt Label */}
                            <div className="flex items-center text-xs text-slate-500 bg-white border border-slate-100 rounded px-2 py-1">
                              <MessageSquare className="w-3 h-3 mr-1.5 text-blue-400" />
                              Label: <span className="font-medium ml-1 text-slate-700">{q.commentPrompt || "Founder's Comments"}</span>
                            </div>

                            {/* Expectations Count / Preview */}
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

        {/* Right Column: Add New Question */}
        <div className="w-full lg:w-96">
          <Card className="sticky top-24 border-blue-200 shadow-md">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle className="text-blue-800">Add New Question</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="p-3 bg-blue-50 rounded-lg flex items-start gap-3 text-sm text-blue-700 mb-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>Adding to <strong>AIRL Level {selectedLevel}</strong>.</p>
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

              {/* Expectations / Guidance Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Expectations / Guidance</label>
                <p className="text-[10px] text-slate-500 mb-1.5">Enter points line-by-line. These appear in the 'Info' popup.</p>
                <Textarea 
                  rows={5}
                  placeholder={"- Cite specific papers\n- Demonstrate understanding\n- Identify core hypothesis"}
                  value={newExpectations}
                  onChange={(e) => setNewExpectations(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>

              {/* Custom Comment Prompt */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Comment Box Label</label>
                <Input 
                  value={newCommentPrompt}
                  onChange={(e) => setNewCommentPrompt(e.target.value)}
                  placeholder="Default: Founder's Comments"
                />
              </div>

              <Button onClick={handleAddQuestion} className="w-full" leftIcon={<Plus className="w-4 h-4" />}>
                Add to Framework
              </Button>

              <div className="border-t border-slate-100 pt-4 mt-4">
                <Button variant="outline" className="w-full" leftIcon={<Save className="w-4 h-4" />}>
                  Save Changes Globally
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  );
}
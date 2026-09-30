"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Type,
  List,
  Save,
  Clock,
  Target
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { Progress } from "@/components/ui/progress";

interface Option {
  id?: number;
  text: string;
  is_correct: boolean;
}

interface Question {
  id?: number;
  text: string;
  type: 'multiple_choice' | 'true_false';
  points: number;
  options: Option[];
}

interface Quiz {
  id?: number;
  title: string;
  description: string;
  passing_score: number;
  time_limit: number | null;
  questions: Question[];
}

interface QuizFormProps {
  courseId: string;
}

export function QuizForm({ courseId }: QuizFormProps) {
  const [quiz, setQuiz] = useState<Quiz>({
    title: "Final Assessment",
    description: "Complete this assessment to earn your certificate.",
    passing_score: 80,
    time_limit: 30,
    questions: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get(`/quizzes/course/${courseId}`);
        if (response.data) {
          setQuiz(response.data);
        }
      } catch (err) {
        const error = err as { response?: { status: number } };
        if (error.response?.status !== 404) {
          console.error("Failed to fetch quiz", error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuiz();
  }, [courseId]);

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          text: "",
          type: "multiple_choice",
          points: 1,
          options: [
            { text: "Option 1", is_correct: true },
            { text: "Option 2", is_correct: false }
          ]
        }
      ]
    });
  };

  const removeQuestion = (qIdx: number) => {
    const newQuestions = [...quiz.questions];
    newQuestions.splice(qIdx, 1);
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const updateQuestion = (qIdx: number, field: string, value: string | number | boolean) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIdx] = { ...newQuestions[qIdx], [field]: value };
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const addOption = (qIdx: number) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIdx].options.push({ text: "", is_correct: false });
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const updateOption = (qIdx: number, oIdx: number, field: string, value: string | boolean) => {
    const newQuestions = [...quiz.questions];
    if (field === 'is_correct' && value === true) {
        // Only one correct option for now for simplicity
        newQuestions[qIdx].options = newQuestions[qIdx].options.map((o, idx) => ({
            ...o,
            is_correct: idx === oIdx
        }));
    } else {
        newQuestions[qIdx].options[oIdx] = { ...newQuestions[qIdx].options[oIdx], [field]: value };
    }
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const removeOption = (qIdx: number, oIdx: number) => {
    const newQuestions = [...quiz.questions];
    if (newQuestions[qIdx].options.length <= 2) return;
    newQuestions[qIdx].options.splice(oIdx, 1);
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const handleSave = async () => {
    // Basic validation
    if (quiz.questions.length === 0) {
        setError("Please add at least one question.");
        return;
    }
    for (const q of quiz.questions) {
        if (!q.text.trim()) {
            setError("All questions must have text.");
            return;
        }
        if (q.options.some(o => !o.text.trim())) {
            setError("All options must have text.");
            return;
        }
    }

    setIsSaving(true);
    setError(null);
    try {
      await api.post("/quizzes", { ...quiz, course_id: courseId });
      alert("Assessment saved successfully!");
    } catch (err) {
      console.error("Failed to save quiz", err);
      setError("Failed to save assessment. Please check your inputs.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-slate-400">Loading assessment...</div>;

  return (
    <Card className="p-8 space-y-8 border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
          <HelpCircle size={14} />
          <span>Final Course Assessment</span>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="rounded-xl px-6 gap-2"
        >
          {isSaving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Save size={16} />}
          Save Assessment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-slate-50 dark:border-slate-800">
        <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
               <Target size={12}/> Passing Score (%)
            </label>
            <Input 
                type="number" 
                value={quiz.passing_score} 
                onChange={(e) => setQuiz({...quiz, passing_score: parseInt(e.target.value)})}
                className="bg-slate-50/50 border-none h-11 focus:bg-white transition-all font-bold"
            />
        </div>
        <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
               <Clock size={12}/> Time Limit (Minutes)
            </label>
            <Input 
                type="number" 
                value={quiz.time_limit || ""} 
                placeholder="No limit"
                onChange={(e) => setQuiz({...quiz, time_limit: e.target.value ? parseInt(e.target.value) : null})}
                className="bg-slate-50/50 border-none h-11 focus:bg-white transition-all font-bold"
            />
        </div>
      </div>

      <div className="space-y-6">
        {quiz.questions.map((question, qIdx) => (
          <Card key={qIdx} className="p-6 bg-slate-50/30 border-slate-100 dark:border-slate-800 space-y-4 group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-xs font-black shadow-sm border border-slate-100 dark:border-slate-700">
                  Q{qIdx + 1}
                </div>
                <select 
                    value={question.type}
                    onChange={(e) => updateQuestion(qIdx, 'type', e.target.value)}
                    className="h-8 px-2 rounded-lg bg-white border border-slate-100 text-[10px] font-bold uppercase tracking-wider focus:outline-none"
                >
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="true_false">True / False</option>
                </select>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => removeQuestion(qIdx)}
                className="h-8 w-8 p-0 text-slate-300 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </Button>
            </div>

            <Textarea 
                value={question.text}
                onChange={(e) => updateQuestion(qIdx, 'text', e.target.value)}
                placeholder="Enter your question here..."
                className="min-h-[80px] bg-white border-slate-100 shadow-none font-medium"
            />

            <div className="space-y-3 pl-4 border-l-2 border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Answer Options</p>
                {question.options.map((option, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-3">
                        <button
                            onClick={() => updateOption(qIdx, oIdx, 'is_correct', true)}
                            className={cn(
                                "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all",
                                option.is_correct ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-200 text-transparent"
                            )}
                        >
                            <CheckCircle2 size={12} />
                        </button>
                        <Input 
                            value={option.text}
                            onChange={(e) => updateOption(qIdx, oIdx, 'text', e.target.value)}
                            placeholder={`Option ${oIdx + 1}`}
                            className="bg-white border-slate-100 h-9 text-xs shadow-none"
                        />
                        {question.options.length > 2 && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeOption(qIdx, oIdx)}
                                className="h-8 w-8 p-0 text-slate-300 hover:text-red-500"
                            >
                                <Trash2 size={14} />
                            </Button>
                        )}
                    </div>
                ))}
                {question.type === 'multiple_choice' && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => addOption(qIdx)}
                        className="text-[10px] font-bold text-primary hover:bg-primary/5 rounded-lg h-8"
                    >
                        <Plus size={12} className="mr-1"/> Add Option
                    </Button>
                )}
            </div>
          </Card>
        ))}

        {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs font-bold">
                <AlertCircle size={16} />
                <span>{error}</span>
            </div>
        )}

        <Button 
            variant="outline" 
            onClick={addQuestion} 
            className="w-full h-16 rounded-2xl border-dashed border-2 text-slate-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all text-xs font-bold uppercase tracking-widest gap-2"
        >
            <Plus size={18} /> Add Assessment Question
        </Button>
      </div>
    </Card>
  );
}

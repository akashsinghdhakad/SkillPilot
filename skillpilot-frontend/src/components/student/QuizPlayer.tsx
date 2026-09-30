"use client";

import { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ArrowRight,
  Trophy,
  RotateCcw,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
  id: number;
  text: string;
}

interface Question {
  id: number;
  text: string;
  type: 'multiple_choice' | 'true_false';
  options: Option[];
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  passing_score: number;
  time_limit: number | null;
  questions: Question[];
}

interface QuizResult {
  score: number;
  status: 'passed' | 'failed';
  total_questions: number;
  correct_answers: number;
}

interface QuizPlayerProps {
  quizId: number;
  onComplete: (attempt: QuizResult) => void;
}

export function QuizPlayer({ quizId, onComplete }: QuizPlayerProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [startedAt] = useState(new Date().toISOString());

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get(`/quizzes/${quizId}`); // Assuming a direct quiz route or similar
        setQuiz(response.data);
        if (response.data.time_limit) {
          setTimeLeft(response.data.time_limit * 60);
        }
      } catch (err) {
        console.error("Failed to fetch quiz", err);
      }
    };
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || result) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, result]);

  if (!quiz) return <div className="p-12 text-center">Loading assessment...</div>;

  const currentQuestion = quiz.questions[currentQuestionIdx];
  const progress = ((currentQuestionIdx + 1) / quiz.questions.length) * 100;

  const handleSelectOption = (optionId: number) => {
    setAnswers({ ...answers, [currentQuestion.id]: optionId });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([qId, oId]) => ({
        question_id: parseInt(qId),
        option_id: oId
      }));
      
      const response = await api.post(`/quizzes/${quizId}/submit`, {
        answers: formattedAnswers,
        started_at: startedAt
      });
      setResult(response.data);
      onComplete(response.data);
    } catch (err) {
      console.error("Failed to submit quiz", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (result) {
    const isPassed = result.status === 'passed';
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto py-12 space-y-8 text-center"
      >
        <div className={cn(
            "h-24 w-24 rounded-full flex items-center justify-center mx-auto shadow-2xl",
            isPassed ? "bg-emerald-500 text-white shadow-emerald-500/30" : "bg-red-500 text-white shadow-red-500/30"
        )}>
            {isPassed ? <Trophy size={48} /> : <AlertCircle size={48} />}
        </div>
        
        <div className="space-y-2">
            <h2 className={cn("text-3xl font-black", isPassed ? "text-emerald-600" : "text-red-600")}>
                {isPassed ? "Congratulations!" : "Keep Practicing!"}
            </h2>
            <p className="text-slate-500 font-medium text-lg">
                {isPassed 
                    ? `You've passed the assessment with a score of ${result.score}%!` 
                    : `Your score was ${result.score}%. You need ${quiz.passing_score}% to pass.`}
            </p>
        </div>

        <Card className="p-6 bg-slate-50/50 border-slate-100 max-w-sm mx-auto">
            <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Your Score</span>
                <span className={cn("text-2xl font-black", isPassed ? "text-emerald-500" : "text-red-500")}>
                    {result.score}%
                </span>
            </div>
            <Progress value={result.score} className="h-2 mt-4" />
        </Card>

        <div className="flex gap-4 justify-center pt-4">
            {!isPassed && (
                <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl px-10 gap-2 h-12 font-bold">
                    <RotateCcw size={18} /> Retry Assessment
                </Button>
            )}
            {isPassed && (
                <Button className="rounded-xl px-12 h-12 font-bold bg-emerald-600 hover:bg-emerald-700">
                    Get My Certificate <ArrowRight size={18} className="ml-2" />
                </Button>
            )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8 px-4">
      <header className="flex items-center justify-between gap-6">
        <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between mb-2">
                 <span className="text-[10px] font-black uppercase text-primary tracking-widest bg-primary/10 px-2 py-0.5 rounded">
                    Assessment
                </span>
                {timeLeft !== null && (
                    <div className={cn(
                        "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold border-2",
                        timeLeft < 60 ? "text-red-500 border-red-100 bg-red-50 animate-pulse" : "text-slate-500 border-slate-100"
                    )}>
                        <Clock size={14} /> {formatTime(timeLeft)}
                    </div>
                )}
            </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {quiz.title}
          </h1>
          <Progress value={progress} className="h-1.5 transition-all" />
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
            key={currentQuestionIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            <Card className="p-8 border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800">
                <div className="space-y-6">
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
                        {currentQuestion.text}
                    </p>

                    <div className="space-y-3">
                        {currentQuestion.options.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => handleSelectOption(option.id)}
                                className={cn(
                                    "w-full text-left p-4 rounded-2xl border-2 transition-all group flex items-center justify-between",
                                    answers[currentQuestion.id] === option.id
                                        ? "border-primary bg-primary/5 text-primary shadow-lg shadow-primary/5"
                                        : "border-slate-50 dark:border-slate-800 hover:border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                )}
                            >
                                <span className="font-semibold">{option.text}</span>
                                <div className={cn(
                                    "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all",
                                    answers[currentQuestion.id] === option.id ? "bg-primary border-primary text-white" : "border-slate-100 group-hover:border-slate-300"
                                )}>
                                    {answers[currentQuestion.id] === option.id && <CheckCircle2 size={14} />}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between pt-4">
          <Button
            variant="ghost"
            onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
            disabled={currentQuestionIdx === 0}
            className="rounded-xl gap-2 font-bold px-6 h-12"
          >
            <ChevronLeft size={20} /> Previous
          </Button>

          {currentQuestionIdx === quiz.questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !Object.keys(answers).includes(currentQuestion.id.toString())}
                className="rounded-xl px-12 h-12 font-bold bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/10"
              >
                {isSubmitting ? "Submitting..." : "Submit Assessment"}
              </Button>
          ) : (
            <Button
                onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                disabled={!Object.keys(answers).includes(currentQuestion.id.toString())}
                className="rounded-xl gap-2 font-bold px-8 h-12 shadow-lg shadow-primary/10"
            >
                Next Question <ChevronRight size={20} />
            </Button>
          )}
      </div>
    </div>
  );
}

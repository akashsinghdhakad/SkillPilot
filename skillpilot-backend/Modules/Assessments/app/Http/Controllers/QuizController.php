<?php

namespace Modules\Assessments\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Assessments\Models\Quiz;
use Modules\Assessments\Models\QuizAttempt;
use Modules\Assessments\Models\Question;
use Modules\Assessments\Models\Option;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class QuizController extends Controller
{
    /**
     * Get the quiz for a specific course.
     */
    public function showByCourse($course_id)
    {
        $quiz = Quiz::with(['questions.options'])
            ->where('course_id', $course_id)
            ->first();

        if (!$quiz) {
            return response()->json(['message' => 'No assessment found for this course'], 404);
        }

        return response()->json($quiz);
    }

    /**
     * Create or update a quiz for a course.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'passing_score' => 'required|integer|min:0|max:100',
            'time_limit' => 'nullable|integer|min:1',
            'questions' => 'required|array|min:1',
            'questions.*.text' => 'required|string',
            'questions.*.type' => 'required|in:multiple_choice,true_false',
            'questions.*.points' => 'required|integer|min:1',
            'questions.*.options' => 'required|array|min:2',
            'questions.*.options.*.text' => 'required|string',
            'questions.*.options.*.is_correct' => 'required|boolean',
        ]);

        return DB::transaction(function () use ($validated) {
            $quiz = Quiz::updateOrCreate(
                ['course_id' => $validated['course_id']],
                [
                    'title' => $validated['title'],
                    'description' => $validated['description'] ?? null,
                    'passing_score' => $validated['passing_score'],
                    'time_limit' => $validated['time_limit'] ?? null,
                ]
            );

            // Simple approach: Delete existing questions and recreate
            // In a production app, we might want to sync ids.
            $quiz->questions()->delete();

            foreach ($validated['questions'] as $qData) {
                $question = $quiz->questions()->create([
                    'text' => $qData['text'],
                    'type' => $qData['type'],
                    'points' => $qData['points'],
                ]);

                foreach ($qData['options'] as $oData) {
                    $question->options()->create([
                        'text' => $oData['text'],
                        'is_correct' => $oData['is_correct'],
                    ]);
                }
            }

            return response()->json($quiz->load('questions.options'), 201);
        });
    }

    /**
     * Submit a quiz attempt.
     */
    public function submit(Request $request, Quiz $quiz)
    {
        $validated = $request->validate([
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:questions,id',
            'answers.*.option_id' => 'required|exists:options,id',
        ]);

        $quiz->load('questions.options');
        $totalPoints = $quiz->questions->sum('points');
        $earnedPoints = 0;

        foreach ($validated['answers'] as $answer) {
            $question = $quiz->questions->find($answer['question_id']);
            $option = $question->options->find($answer['option_id']);

            if ($option && $option->is_correct) {
                $earnedPoints += $question->points;
            }
        }

        $score = ($totalPoints > 0) ? round(($earnedPoints / $totalPoints) * 100) : 0;
        $status = ($score >= $quiz->passing_score) ? 'passed' : 'failed';

        $attempt = QuizAttempt::create([
            'user_id' => auth()->id(),
            'quiz_id' => $quiz->id,
            'score' => $score,
            'status' => $status,
            'started_at' => $request->input('started_at'),
            'completed_at' => now(),
        ]);

        return response()->json($attempt);
    }
}

<?php

use Illuminate\Support\Facades\Route;
use Modules\Assessments\Http\Controllers\QuizController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::get('quizzes/course/{course_id}', [QuizController::class, 'showByCourse']);
    Route::post('quizzes', [QuizController::class, 'store']);
    Route::post('quizzes/{quiz}/submit', [QuizController::class, 'submit']);
});

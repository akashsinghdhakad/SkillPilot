<?php

use Illuminate\Support\Facades\Route;
use Modules\Lessons\Http\Controllers\LessonController;

Route::middleware(['auth:sanctum', 'tenant'])->group(function () {
    // Admin/Instructor only 
    Route::middleware(['role:instructor,admin'])->group(function () {
        Route::post('lessons', [LessonController::class, 'store']);
        Route::put('lessons/{lesson}', [LessonController::class, 'update']);
        Route::delete('lessons/{lesson}', [LessonController::class, 'destroy']);
        Route::patch('lessons/{lesson}/toggle-status', [LessonController::class, 'toggleStatus']);
    });

    // Student/Instructor/Admin access to show, but protected by enrollment for students
    Route::get('lessons/{lesson}', [LessonController::class, 'show'])
        ->middleware('enrollment');
});

<?php

use Illuminate\Support\Facades\Route;
use Modules\Courses\Http\Controllers\CourseController;

Route::middleware(['auth:sanctum', 'tenant'])->group(function () {
    // Public/Student routes
    Route::get('courses', [CourseController::class, 'index']);
    Route::get('courses/{course}', [CourseController::class, 'show']);

    // Admin/Instructor only
    Route::middleware(['role:admin,instructor'])->group(function () {
        Route::post('courses', [CourseController::class, 'store']);
        Route::put('courses/{course}', [CourseController::class, 'update']);
        Route::delete('courses/{course}', [CourseController::class, 'destroy']);
        
        Route::post('courses/{course}/sections', [CourseController::class, 'addSection']);
        Route::delete('sections/{section}', [CourseController::class, 'deleteSection']);
        Route::patch('sections/{section}/toggle-status', [CourseController::class, 'toggleSectionStatus']);
        Route::put('sections/{section}', [CourseController::class, 'updateSection']);
    });
});

<?php

use Illuminate\Support\Facades\Route;
use Modules\Enrollments\Http\Controllers\EnrollmentController;

Route::middleware(['auth:sanctum', 'tenant'])->group(function () {
    Route::get('enrollments', [EnrollmentController::class, 'index']);
    Route::post('enrollments', [EnrollmentController::class, 'store']);
    Route::post('enrollments/unlock', [EnrollmentController::class, 'unlock']);
    Route::post('enrollments/lessons/{lesson}/complete', [EnrollmentController::class, 'markLessonComplete']);
});

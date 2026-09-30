<?php

namespace Modules\Enrollments\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Modules\Lessons\Models\CourseLesson;

use App\Models\Traits\BelongsToTenant;

class LessonProgress extends Model
{
    use BelongsToTenant;

    protected $table = 'lesson_progress';

    protected $fillable = [
        'tenant_id',
        'user_id',
        'lesson_id',
        'is_completed',
        'completed_at',
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function lesson()
    {
        return $this->belongsTo(CourseLesson::class, 'lesson_id');
    }
}

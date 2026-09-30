<?php

namespace Modules\Assessments\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Traits\BelongsToTenant;
// use Modules\Assessments\Database\Factories\QuizFactory;

class Quiz extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'course_id',
        'title',
        'description',
        'passing_score',
        'time_limit',
        'is_active',
    ];

    public function course()
    {
        return $this->belongsTo(\Modules\Courses\Models\Course::class);
    }

    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    public function attempts()
    {
        return $this->hasMany(QuizAttempt::class);
    }
}

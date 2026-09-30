<?php

namespace Modules\Courses\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\SoftDeletes;

class CourseSection extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['course_id', 'title', 'sort_order', 'is_active'];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function lessons()
    {
        return $this->hasMany(\Modules\Lessons\Models\CourseLesson::class, 'section_id')->orderBy('sort_order');
    }
}

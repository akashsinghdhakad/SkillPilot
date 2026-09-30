<?php

namespace Modules\Lessons\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\SoftDeletes;

class CourseLesson extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'section_id',
        'title',
        'content_type',
        'content_path',
        'sort_order',
        'duration',
        'is_active',
    ];

    public function section()
    {
        return $this->belongsTo(\Modules\Courses\Models\CourseSection::class, 'section_id');
    }

    public function course()
    {
        return $this->belongsTo(\Modules\Courses\Models\Course::class);
    }
}

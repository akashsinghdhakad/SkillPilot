<?php

namespace Modules\Courses\Models;

use App\Models\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use HasFactory, BelongsToTenant, SoftDeletes;

    protected $fillable = [
        'tenant_id',
        'title',
        'description',
        'price',
        'status',
        'thumbnail',
        'is_active',
        'required_level',
    ];

    // Relationships
    public function sections()
    {
        return $this->hasMany(CourseSection::class)->orderBy('sort_order');
    }

    public function lessons()
    {
        return $this->hasManyThrough(
            \Modules\Lessons\Models\CourseLesson::class,
            CourseSection::class,
            'course_id', // Foreign key on sections table...
            'section_id', // Foreign key on lessons table...
            'id', // Local key on courses table...
            'id' // Local key on sections table...
        );
    }

    public function progress()
    {
        return $this->hasMany(\Modules\Progress\Models\CourseProgress::class);
    }

    public function certificates()
    {
        return $this->hasMany(\Modules\Certificates\Models\Certificate::class);
    }
}

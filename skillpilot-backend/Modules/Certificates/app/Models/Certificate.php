<?php

namespace Modules\Certificates\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Certificate extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'course_id', 'certificate_no', 'issued_at'];

    protected $casts = [
        'issued_at' => 'datetime',
    ];

    // Auto-generate certificate number on creation
    protected static function booted(): void
    {
        static::creating(function ($certificate) {
            if (empty($certificate->certificate_no)) {
                $certificate->certificate_no = 'CERT-' . strtoupper(Str::random(10));
            }
            if (empty($certificate->issued_at)) {
                $certificate->issued_at = now();
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function course()
    {
        return $this->belongsTo(\Modules\Courses\Models\Course::class);
    }
}

<?php

namespace Modules\Packages\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Package extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'user_limit',
        'course_limit',
        'storage_limit',
        'is_active',
    ];

    public function licenses()
    {
        return $this->hasMany(\Modules\Licenses\Models\License::class);
    }
}

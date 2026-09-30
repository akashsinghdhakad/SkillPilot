<?php

namespace Modules\Bundles\Models;

use App\Models\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Modules\Courses\Models\Course;

class Bundle extends Model
{
    use HasFactory, BelongsToTenant, SoftDeletes;

    protected $fillable = [
        'tenant_id',
        'title',
        'description',
        'price',
        'thumbnail',
        'is_active',
    ];

    /**
     * Relationship to the courses included in this bundle.
     */
    public function courses()
    {
        return $this->belongsToMany(Course::class, 'bundle_items');
    }

    /**
     * Relationship to student purchases of this bundle.
     */
    public function purchases()
    {
        return $this->hasMany(BundlePurchase::class);
    }
}

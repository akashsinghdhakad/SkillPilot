<?php

namespace Modules\Licenses\Models;

use App\Models\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class License extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'package_id',
        'starts_at',
        'expires_at',
        'status',
    ];

    protected $casts = [
        'starts_at'  => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function package()
    {
        return $this->belongsTo(\Modules\Packages\Models\Package::class);
    }
}

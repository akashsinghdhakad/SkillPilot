<?php

namespace App\Models\Traits;

use App\Models\Scopes\TenantScope;
use Illuminate\Support\Facades\Config;

trait BelongsToTenant
{
    /**
     * The "booted" method of the model.
     * Apply the tenant scope automatically.
     */
    protected static function booted(): void
    {
        static::addGlobalScope(new TenantScope);
    }

    /**
     * Automatically set the tenant_id when creating a model.
     */
    protected static function bootBelongsToTenant()
    {
        static::creating(function ($model) {
            $tenantId = Config::get('app.current_tenant_id');
            if ($tenantId && empty($model->tenant_id)) {
                $model->tenant_id = $tenantId;
            }
        });
    }
}

<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Config;

class TenantScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        $tenantId = Config::get('app.current_tenant_id');

        // If no tenant is set, you might want to block access or allow it depending on your needs.
        // For strict SaaS, we only apply if tenantId is set, otherwise throw an exception or return nothing.
        if ($tenantId) {
            $builder->where($model->getTable() . '.tenant_id', $tenantId);
        } else {
            // Optional: Block query completely if tenant is not resolved and we are in tenant scope
            // $builder->whereRaw('1 = 0');
        }
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ResolveTenant
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // For SkillPilot, we resolve tenant based on the authenticated user.
        // If a user belongs to a tenant, we get their tenant_id.
        // Alternatively, it can be passed via Header for API requests: 'X-Tenant-Id'
        
        $tenantId = $request->header('X-Tenant-Id') ?? ($request->user() ? $request->user()->tenant_id : null);
        
        if ($tenantId) {
            \Illuminate\Support\Facades\Config::set('app.current_tenant_id', $tenantId);
        } else {
            // Depending on strictness, we might block access if no tenant is found on protected routes.
            // \abort(403, 'Tenant not specified.');
        }

        return $next($request);
    }
}

<?php

namespace Modules\Admin\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Tenants\Models\Tenant;
use App\Models\User;
use Modules\Courses\Models\Course;
use App\Models\Scopes\TenantScope;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Get global platform statistics.
     */
    public function getStats()
    {
        return response()->json([
            'total_tenants' => Tenant::count(),
            'total_users' => User::withoutGlobalScope(TenantScope::class)->count(),
            'total_courses' => Course::withoutGlobalScope(TenantScope::class)->count(),
            'active_sessions' => DB::table('personal_access_tokens')->count(), // rough estimate
        ]);
    }

    /**
     * Get all tenants.
     */
    public function getTenants()
    {
        $tenants = Tenant::withCount('users')->get();
        return response()->json($tenants);
    }

    /**
     * Get all users across all tenants.
     */
    public function getUsers()
    {
        $users = User::withoutGlobalScope(TenantScope::class)
            ->with(['roles', 'tenant'])
            ->latest()
            ->paginate(20);
            
        return response()->json($users);
    }

    /**
     * Get all courses across all tenants.
     */
    public function getCourses()
    {
        $courses = Course::withoutGlobalScope(TenantScope::class)
            ->with(['tenant'])
            ->withCount('lessons')
            ->latest()
            ->paginate(20);

        return response()->json($courses);
    }

    /**
     * Toggle tenant status.
     */
    public function toggleTenantStatus(Request $request, Tenant $tenant)
    {
        $tenant->update([
            'is_active' => !$tenant->is_active
        ]);

        return response()->json([
            'message' => 'Tenant status updated',
            'tenant' => $tenant
        ]);
    }
}

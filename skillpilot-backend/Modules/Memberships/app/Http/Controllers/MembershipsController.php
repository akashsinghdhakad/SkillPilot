<?php

namespace Modules\Memberships\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Memberships\Models\MembershipPlan;
use Modules\Memberships\Models\Subscription;

class MembershipsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $plans = MembershipPlan::where('is_active', true)
            ->orderBy('level', 'asc')
            ->get();
            
        return response()->json($plans);
    }

    /**
     * Get the authenticated user's current subscription.
     */
    public function status(Request $request)
    {
        $subscription = Subscription::where('user_id', $request->user()->id)
            ->active()
            ->with('plan')
            ->first();

        return response()->json($subscription);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('memberships::create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) {}

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        return view('memberships::show');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return view('memberships::edit');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id) {}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id) {}
}

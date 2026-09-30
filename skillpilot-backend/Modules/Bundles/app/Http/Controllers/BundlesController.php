<?php

namespace Modules\Bundles\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Bundles\Models\Bundle;
use Modules\Bundles\Models\BundlePurchase;

class BundlesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bundles = Bundle::where('is_active', true)
            ->withCount('courses')
            ->get();
            
        return response()->json($bundles);
    }

    /**
     * Get bundles owned by the authenticated user.
     */
    public function owned(Request $request)
    {
        $purchases = BundlePurchase::where('user_id', $request->user()->id)
            ->with('bundle.courses')
            ->get()
            ->pluck('bundle');

        return response()->json($purchases);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('bundles::create');
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
        return view('bundles::show');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return view('bundles::edit');
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

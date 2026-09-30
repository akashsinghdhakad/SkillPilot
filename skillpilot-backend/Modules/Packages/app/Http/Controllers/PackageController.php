<?php

namespace Modules\Packages\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Modules\Packages\Models\Package;

class PackageController extends Controller
{
    /**
     * List all active packages.
     */
    public function index()
    {
        $packages = Package::where('is_active', true)->get();
        return response()->json($packages);
    }
}

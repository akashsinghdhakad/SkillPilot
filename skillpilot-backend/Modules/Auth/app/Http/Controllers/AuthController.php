<?php

namespace Modules\Auth\Http\Controllers;

use App\Models\User;
use Modules\Roles\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(Request $request)
    {
        $request->validate([
            'name'      => 'required|string|max:191',
            'email'     => 'required|email|unique:users,email',
            'password'  => 'required|string|min:8|confirmed',
            'tenant_id' => 'nullable|integer|exists:tenants,id',
        ]);

        $user = User::create([
            'tenant_id' => $request->tenant_id,
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'status'    => 'active',
        ]);

        // 2. Assign default role (student)
        $studentRole = Role::where('slug', 'student')->first();
        if ($studentRole) {
            $user->roles()->attach($studentRole->id);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user'  => $user->load('roles'),
            'token' => $token,
        ], 201);
    }

    /**
     * Login user and return token.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        // withoutGlobalScopes since login doesn't know tenant yet
        $user = User::withoutGlobalScopes()->where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($user->status !== 'active') {
            return response()->json(['message' => 'Account suspended.'], 403);
        }

        $token = $user->createToken('auth-token')->plainTextToken;
 
         return response()->json([
             'user'  => $user->load('roles'),
             'token' => $token,
         ], 200);
    }

    /**
     * Logout user (revoke token).
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out.']);
    }

    /**
     * Get the authenticated user.
     */
    public function me(Request $request)
    {
        return response()->json($request->user()->load('roles'));
    }
}

<?php

namespace Modules\Auth\Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use Modules\Tenants\Models\Tenant;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register()
    {
        $tenant = Tenant::create(['name' => 'Test Tenant', 'domain' => 'test.com', 'slug' => 'test-tenant']);

        \Modules\Roles\Models\Role::create(['name' => 'Student', 'slug' => 'student']);

        $response = $this->postJson('/api/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'tenant_id' => $tenant->id,
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'user' => [
                         'id', 'name', 'email', 'roles'
                     ], 
                     'token'
                 ]);
        
        $this->assertDatabaseHas('users', ['email' => 'john@example.com']);
    }

    public function test_user_can_login()
    {
        $tenant = Tenant::create(['name' => 'Test Tenant', 'domain' => 'test.com', 'slug' => 'test-tenant']);
        $user = User::factory()->create([
            'email' => 'jane@example.com',
            'password' => bcrypt('password123'),
            'tenant_id' => $tenant->id,
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'jane@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['token']);
    }

    public function test_authenticated_user_can_get_me()
    {
        $tenant = Tenant::create(['name' => 'Test Tenant', 'domain' => 'test.com', 'slug' => 'test-tenant']);
        $user = User::factory()->create(['tenant_id' => $tenant->id]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/me');

        $response->assertStatus(200)
                 ->assertJson(['email' => $user->email]);
    }
}

<?php

namespace Modules\Tenants\Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use Modules\Tenants\Models\Tenant;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class BrandingTest extends TestCase
{
    use RefreshDatabase;

    protected $tenant;
    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        
        Storage::fake('public');
        
        $this->tenant = Tenant::create([
            'name' => 'Branding Test Tenant', 
            'slug' => 'branding-test'
        ]);
        
        $adminRole = \Modules\Roles\Models\Role::create(['name' => 'Admin', 'slug' => 'admin']);

        $this->admin = User::factory()->create([
            'tenant_id' => $this->tenant->id,
        ]);
        $this->admin->roles()->attach($adminRole->id);
    }

    public function test_admin_can_retrieve_branding()
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/tenant/branding');

        $response->assertStatus(200)
            ->assertJsonStructure(['name', 'logo_url', 'signature_url', 'brand_color']);
    }

    public function test_admin_can_update_branding_color()
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/tenant/branding', [
                'brand_color' => '#FF0000'
            ]);

        $response->assertStatus(200);
        $this->assertEquals('#FF0000', $this->tenant->fresh()->brand_color);
    }

    public function test_admin_can_upload_branding_assets()
    {
        $logo = UploadedFile::fake()->image('logo.png');
        $signature = UploadedFile::fake()->image('signature.png');

        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/tenant/branding', [
                'logo' => $logo,
                'signature' => $signature,
                'brand_color' => '#00FF00'
            ]);

        $response->assertStatus(200);
        
        $tenant = $this->tenant->fresh();
        $this->assertNotNull($tenant->certificate_logo_path);
        $this->assertNotNull($tenant->certificate_signature_path);
        $this->assertEquals('#00FF00', $tenant->brand_color);

        Storage::disk('public')->assertExists($tenant->certificate_logo_path);
        Storage::disk('public')->assertExists($tenant->certificate_signature_path);
    }

    public function test_branding_validation_rules()
    {
        // Invalid color
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/tenant/branding', [
                'brand_color' => 'not-a-color'
            ]);

        $response->assertStatus(422);

        // Invalid file type
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/tenant/branding', [
                'logo' => UploadedFile::fake()->create('document.pdf')
            ]);

        $response->assertStatus(422);
    }

    public function test_mitigation_of_lfi_vulnerability()
    {
        // Simulate a scenario where the DB contains a malicious path (e.g. from a separate vulnerability)
        // Note: We bypass mass-assignment or validation to simulate a direct DB manipulation
        $this->tenant->update([
            'certificate_logo_path' => '../../.env'
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/tenant/branding');

        // The URL should be default because the path failed the sandbox check
        $response->assertStatus(200);
        $this->assertStringContainsString('default-logo.png', $response->json('logo_url'));
    }
}

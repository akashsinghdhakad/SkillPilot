<?php

namespace Modules\Tenants\Database\Seeders;

use Illuminate\Database\Seeder;

class TenantsDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \Modules\Tenants\Models\Tenant::create([
            'name' => 'Main Academy',
            'slug' => 'main',
            'status' => 'active'
        ]);

        \Modules\Tenants\Models\Tenant::create([
            'name' => 'Tech School',
            'slug' => 'tech',
            'status' => 'active'
        ]);
    }
}

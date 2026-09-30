<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Roles
        $adminRole = \Modules\Roles\Models\Role::updateOrCreate(
            ['slug' => 'admin'],
            ['name' => 'Admin', 'description' => 'System Administrator']
        );

        $instructorRole = \Modules\Roles\Models\Role::updateOrCreate(
            ['slug' => 'instructor'],
            ['name' => 'Instructor', 'description' => 'Course Creator']
        );

        $studentRole = \Modules\Roles\Models\Role::updateOrCreate(
            ['slug' => 'student'],
            ['name' => 'Student', 'description' => 'Learner']
        );

        // 2. Create Users and Attach Roles
        $admin = \App\Models\User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'tenant_id' => 1,
                'status' => 'active'
            ]
        );
        $admin->roles()->syncWithoutDetaching([$adminRole->id]);

        $instructor = \App\Models\User::updateOrCreate(
            ['email' => 'instructor@example.com'],
            [
                'name' => 'Instructor User',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'tenant_id' => 1,
                'status' => 'active'
            ]
        );
        $instructor->roles()->syncWithoutDetaching([$instructorRole->id]);

        $student = \App\Models\User::updateOrCreate(
            ['email' => 'student@example.com'],
            [
                'name' => 'Student User',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'tenant_id' => 1,
                'status' => 'active'
            ]
        );
        $student->roles()->syncWithoutDetaching([$studentRole->id]);
    }
}

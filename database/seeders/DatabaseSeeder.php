<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->count(20)->create();

        $this->call([
            FeatureSeeder::class,
            TypeHouseSeeder::class,

            // HouseSeeder::class,
            // VisitSeeder::class,
            PermissionSeeder::class,
            RoleSeeder::class,
        ]);

        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('test')
        ]);

        $user->roles()->attach(1);
    }
}

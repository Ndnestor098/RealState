<?php

namespace Database\Seeders;

use App\Models\Feature;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FeatureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $array = [
            "Air conditioning",
            "Built-in wardrobes",
            "Elevator",
            "Balcony and terrace",
            "Showcase",
            "Garage",
            "Garden",
            "Swimming pool",
            "Cellar",
            "Accessible house",
            "Luxury house",
            "Sea view"
        ];

        foreach ($array as $item) {
            Feature::create([
                'name' => $item
            ]);
        }
    }
}

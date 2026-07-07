<?php

namespace Database\Seeders;

use App\Models\Color;
use Illuminate\Database\Seeder;

class ColorSeeder extends Seeder
{
    public function run()
    {
        Color::insert([
            ['name'=>'Black'],
            ['name'=>'White'],
            ['name'=>'Blue'],
            ['name'=>'Red'],
            ['name'=>'Green'],
            ['name'=>'Brown'],
            ['name'=>'Gray'],
            ['name'=>'Yellow'],
            ['name'=>'Purple'],
            ['name'=>'Pink']
        ]);
    }
}

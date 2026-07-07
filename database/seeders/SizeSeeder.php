<?php

namespace Database\Seeders;

use App\Models\Size;
use Illuminate\Database\Seeder;

class SizeSeeder extends Seeder
{
    public function run()
    {
        Size::insert([
            ['name'=>'S'],
            ['name'=>'M'],
            ['name'=>'L'],
            ['name'=>'XL'],
            ['name'=>'XXL']
        ]);
    }
}

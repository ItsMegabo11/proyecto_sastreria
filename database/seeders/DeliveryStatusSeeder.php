<?php

namespace Database\Seeders;

use App\Models\DeliveryStatus;
use Illuminate\Database\Seeder;

class DeliveryStatusSeeder extends Seeder
{
    public function run()
    {
        DeliveryStatus::insert([
            ['name'=>'Pending'],
            ['name'=>'On The Way'],
            ['name'=>'Delivered']
        ]);
    }
}

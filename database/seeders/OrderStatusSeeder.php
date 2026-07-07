<?php

namespace Database\Seeders;

use App\Models\OrderStatus;
use Illuminate\Database\Seeder;

class OrderStatusSeeder extends Seeder
{
    public function run()
    {
        OrderStatus::insert([
            ['name'=>'Pending'],
            ['name'=>'In Progress'],
            ['name'=>'Finished'],
            ['name'=>'Delivered']
        ]);
    }
}
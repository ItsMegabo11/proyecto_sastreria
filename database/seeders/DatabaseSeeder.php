<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'Jose',
            'email' => 'jose@gmail.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now()
        ]);

        $this->call([
            SizeSeeder::class,
            ColorSeeder::class,
            OrderStatusSeeder::class,
            PaymentMethodSeeder::class,
            DeliveryStatusSeeder::class,
            EmployeeSeeder::class,
            CustomerSeeder::class,
            OrderSeeder::class,
            PaymentSeeder::class,
            DeliverySeeder::class
        ]);
    }
}

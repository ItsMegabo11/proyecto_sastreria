<?php

namespace Database\Factories;

use App\Models\Color;
use App\Models\Customer;
use App\Models\OrderStatus;
use App\Models\Size;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    public function definition()
    {
        return [
            'order_date'=>now(),
            'delivery_date'=>now()->addDays(rand(5,15)),
            'price'=>$this->faker->randomFloat(2,100,5000),
            'customer_id'=>Customer::inRandomOrder()->first()->id,
            'size_id'=>Size::inRandomOrder()->first()->id,
            'color_id'=>Color::inRandomOrder()->first()->id,
            'order_status_id'=>OrderStatus::inRandomOrder()->first()->id
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\DeliveryStatus;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

class DeliveryFactory extends Factory
{
    public function definition()
    {
        return [
            'final_delivery_date'=>now()->addDays(rand(5,20)),
            'delivery_address'=>$this->faker->address(),
            'phone'=>$this->faker->randomElement(['6','7']).$this->faker->numerify('#######'),
            'order_id'=>Order::inRandomOrder()->first()->id,
            'delivery_status_id'=>DeliveryStatus::inRandomOrder()->first()->id
        ];
    }
}

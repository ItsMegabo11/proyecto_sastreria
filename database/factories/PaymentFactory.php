<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\PaymentMethod;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    public function definition()
    {
        return [
            'amount'=>$this->faker->randomFloat(2,50,5000),
            'payment_date'=>now(),
            'order_id'=>Order::inRandomOrder()->first()->id,
            'payment_method_id'=>PaymentMethod::inRandomOrder()->first()->id
        ];
    }
}

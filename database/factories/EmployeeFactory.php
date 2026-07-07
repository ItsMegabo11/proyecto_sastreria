<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmployeeFactory extends Factory
{
    public function definition()
    {
        return [
            'first_name'=>$this->faker->firstName(),
            'last_name'=>$this->faker->lastName(),
            'phone'=>$this->faker->randomElement(['6','7']).$this->faker->numerify('#######'),
            'hire_date'=>$this->faker->date(),
            'salary'=>$this->faker->randomFloat(2,2500,7000),
            'user_id'=>User::factory()
        ];
    }
}

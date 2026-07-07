<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class CustomerFactory extends Factory
{
    public function definition()
    {
        return [
            'first_name'=>$this->faker->firstName(),
            'last_name'=>$this->faker->lastName(),
            'phone'=>$this->faker->randomElement(['6','7']).$this->faker->numerify('#######'),
            'address'=>$this->faker->address(),
            'employee_id'=>Employee::factory()
        ];
    }
}
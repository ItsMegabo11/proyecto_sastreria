<?php

namespace Database\Seeders;

use App\Models\PaymentMethod;
use Illuminate\Database\Seeder;

class PaymentMethodSeeder extends Seeder
{
    public function run()
    {
        PaymentMethod::insert([
            ['name'=>'Cash'],
            ['name'=>'Transfer'],
            ['name'=>'QR'],
            ['name'=>'Card']
        ]);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Delivery extends Model
{
    use HasFactory;

    protected $fillable = [
        'final_delivery_date',
        'delivery_address',
        'phone',
        'order_id',
        'delivery_status_id'
    ];
    
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
    
    public function deliveryStatus()
    {
        return $this->belongsTo(DeliveryStatus::class);
    }
}

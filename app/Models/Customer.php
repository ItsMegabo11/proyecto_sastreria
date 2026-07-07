<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'phone',
        'address',
        'employee_id'
    ];
    
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
    
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}

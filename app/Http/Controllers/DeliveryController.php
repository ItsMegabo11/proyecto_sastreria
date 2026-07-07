<?php

namespace App\Http\Controllers;

use App\Models\Delivery;
use Illuminate\Http\Request;

class DeliveryController extends Controller
{
    public function index()
    {
        $deliveries = Delivery::with([
            'order:id,price',
            'deliveryStatus:id,name'
        ])->get();

        return response()->json([
            'datos'=>$deliveries,
            'mensaje'=>'Lista de entregas'
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'final_delivery_date'=>'required|date',
            'delivery_address'=>'required|string|max:255',
            'phone'=>'required|regex:/^[67][0-9]{7}$/|digits:8',
            'order_id'=>'required|exists:orders,id',
            'delivery_status_id'=>'required|exists:delivery_statuses,id'
        ]);

        $delivery = Delivery::create($validated);

        return response()->json([
            'datos'=>$delivery->load([
                'order:id,price',
                'deliveryStatus:id,name'
            ]), 'mensaje'=>'Entrega creada con éxito'
        ], 201);
    }

    public function show(Delivery $delivery)
    {
        return response()->json([
            'datos'=>$delivery->load([
                'order:id,price',
                'deliveryStatus:id,name'
            ]), 'mensaje'=>'Entrega mostrada con éxito'
        ], 200);
    }

    public function update(Request $request, Delivery $delivery)
    {
        $validated=$request->validate([
            'final_delivery_date'=>'required|date',
            'delivery_address'=>'required|string|max:255',
            'phone'=>'required|regex:/^[67][0-9]{7}$/|digits:8',
            'order_id'=>'required|exists:orders,id',
            'delivery_status_id'=>'required|exists:delivery_statuses,id'
        ]);

        $delivery->update($validated);

        return response()->json([
            'datos'=>$delivery->load([
                'order:id,price',
                'deliveryStatus:id,name'
            ]), 'mensaje'=>'Entrega actualizada con éxito'
        ], 200);
    }

    public function destroy(Delivery $delivery)
    {
        $delivery->delete();

        return response()->json([
            'mensaje'=>'Entrega eliminada con éxito'
        ], 200);
    }
}
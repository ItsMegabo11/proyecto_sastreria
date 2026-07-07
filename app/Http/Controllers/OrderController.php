<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        $orders=Order::with([
            'customer:id,first_name,last_name',
            'size:id,name',
            'color:id,name',
            'orderStatus:id,name'
        ])->get();

        return response()->json([
            'datos'=>$orders,
            'mensaje'=>'Lista de pedidos'
        ], 200);
    }

    public function store(Request $request)
    {
        $validated=$request->validate([
            'order_date'=>'required|date',
            'delivery_date'=>'required|date',
            'price'=>'required|numeric|min:0',
            'customer_id'=>'required|exists:customers,id',
            'size_id'=>'required|exists:sizes,id',
            'color_id'=>'required|exists:colors,id',
            'order_status_id'=>'required|exists:order_statuses,id'
        ]);

        $order=Order::create($validated);

        return response()->json([
            'datos'=>$order->load([
                'customer:id,first_name,last_name',
                'size:id,name',
                'color:id,name',
                'orderStatus:id,name'
            ]), 'mensaje'=>'Pedido creado con éxito'
        ], 201);
    }

    public function show(Order $order)
    {
        return response()->json([
            'datos'=>$order->load([
                'customer:id,first_name,last_name',
                'size:id,name',
                'color:id,name',
                'orderStatus:id,name'
            ]), 'mensaje'=>'Pedido mostrado con éxito'
        ], 200);
    }

    public function update(Request $request, Order $order)
    {
        $validated=$request->validate([
            'order_date'=>'required|date',
            'delivery_date'=>'required|date',
            'price'=>'required|numeric|min:0',
            'customer_id'=>'required|exists:customers,id',
            'size_id'=>'required|exists:sizes,id',
            'color_id'=>'required|exists:colors,id',
            'order_status_id'=>'required|exists:order_statuses,id'
        ]);

        $order->update($validated);

        return response()->json([
            'datos'=>$order->load([
                'customer:id,first_name,last_name',
                'size:id,name',
                'color:id,name',
                'orderStatus:id,name'
            ]), 'mensaje'=>'Pedido actualizado con éxito'
        ], 200);
    }

    public function destroy(Order $order)
    {
        $order->delete();

        return response()->json([
            'mensaje'=>'Pedido eliminado con éxito'
        ], 200);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index()
    {
        $payments=Payment::with([
            'order:id,price',
            'paymentMethod:id,name'
        ])->get();

        return response()->json([
            'datos'=>$payments,
            'mensaje'=>'Lista de pagos'
        ], 200);
    }

    public function store(Request $request)
    {
        $validated=$request->validate([
            'amount'=>'required|numeric|min:0',
            'payment_date'=>'required|date',
            'order_id'=>'required|exists:orders,id',
            'payment_method_id'=>'required|exists:payment_methods,id'
        ]);

        $payment=Payment::create($validated);

        return response()->json([
            'datos'=>$payment->load([
                'order:id,price',
                'paymentMethod:id,name'
            ]), 'mensaje'=>'Pago creado con éxito'
        ], 201);
    }

    public function show(Payment $payment)
    {
        return response()->json([
            'datos'=>$payment->load([
                'order:id,price',
                'paymentMethod:id,name'
            ]), 'mensaje'=>'Pago mostrado con éxito'
        ], 200);
    }

    public function update(Request $request, Payment $payment)
    {
        $validated=$request->validate([
            'amount'=>'required|numeric|min:0',
            'payment_date'=>'required|date',
            'order_id'=>'required|exists:orders,id',
            'payment_method_id'=>'required|exists:payment_methods,id'
        ]);

        $payment->update($validated);

        return response()->json([
            'datos'=>$payment->load([
                'order:id,price',
                'paymentMethod:id,name'
            ]), 'mensaje'=>'Pago actualizado con éxito'
        ], 200);
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();

        return response()->json([
            'mensaje'=>'Pago eliminado con éxito'
        ], 200);
    }
}

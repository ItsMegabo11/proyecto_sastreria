<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(){
        $customers=Customer::with([
            'employee:id,first_name,last_name,phone'
        ])->get();

        return response()->json([
            'datos'=>$customers,
            'mensaje'=>'Lista de clientes'
        ], 200);
    }

    public function store(Request $request){
        $validated=$request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'phone' => 'required|regex:/^[67][0-9]{7}$/|digits:8',
            'address' => 'required|string|max:255',
            'employee_id' => 'required|exists:employees,id'
        ]);

        $customer = Customer::create($validated);

        return response()->json([
            'datos'=>$customer->load([
                'employee:id,first_name,last_name,phone'
            ]),'mensaje'=>'Cliente creado con éxito'
        ], 201);
    }

    public function show(Customer $customer){
        return response()->json([
            'datos' => $customer->load([
                'employee:id,first_name,last_name,phone'
            ]), 'mensaje'=>'Cliente mostrado con éxito'
        ], 200);
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'phone' => 'required|regex:/^[67][0-9]{7}$/|digits:8',
            'address' => 'required|string|max:255',
            'employee_id' => 'required|exists:employees,id'
        ]);

        $customer->update($validated);

        return response()->json([
            'datos' => $customer->load([
                'employee:id,first_name,last_name,phone'
            ]), 'mensaje'=>'Cliente actualizado con éxito'
        ], 200);
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();

        return response()->json([
            'mensaje' => 'Cliente eliminado con éxito'
        ], 200);
    }
}

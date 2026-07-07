<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index()
    {
        $employees=Employee::with('user:id,name,email')->get();

        return response()->json([
            'datos'=>$employees,
            'mensaje'=>'Lista de empleados'
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name'=>'required|string|max:100',
            'last_name'=>'required|string|max:100',
            'phone'=>'required|regex:/^[67][0-9]{7}$/|digits:8',
            'hire_date'=>'required|date',
            'salary'=>'required|numeric|min:0',
            'user_id'=>'nullable|exists:users,id'
        ]);

        $employee = Employee::create($validated);

        return response()->json([
            'datos'=>$employee->load('user:id,name,email'),
            'mensaje'=>'Empleado creado con éxito'
        ], 201);
    }

    public function show(Employee $employee)
    {
        return response()->json([
            'datos'=>$employee->load('user:id,name,email'),
            'mensaje'=>'Empleado mostrado con éxito'
        ], 200);
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'first_name'=>'required|string|max:100',
            'last_name'=>'required|string|max:100',
            'phone'=>'required|regex:/^[67][0-9]{7}$/|digits:8',
            'hire_date'=>'required|date',
            'salary'=>'required|numeric|min:0',
            'user_id'=>'nullable|exists:users,id'
        ]);

        $employee->update($validated);

        return response()->json([
            'datos'=>$employee->load('user:id,name,email'),
            'mensaje'=>'Empleado actualizado con éxito'
        ], 200);
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();

        return response()->json([
            'mensaje'=>'Empleado eliminado con éxito'
        ], 200);
    }
}
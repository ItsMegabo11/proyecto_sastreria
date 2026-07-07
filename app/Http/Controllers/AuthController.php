<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request){
        $request->validate([
            'name'=>'required|string|max:100',
            'email'=>'required|string|email|max:100|unique:users',
            'password'=>'required|string|min:8|confirmed',
            'first_name'=>'required|regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/|max:100',
            'last_name'=>'required|regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/|max:100',
            'phone'=>'required|digits:8',
            'hire_date'=>'required|date',
            'salary'=>'required|numeric|min:0'
        ]);

        $user=User::create([
            'name'=>$request->name,
            'email'=>$request->email,
            'password'=>Hash::make($request->password)
        ]);

        Employee::create([
            'first_name'=>$request->first_name,
            'last_name'=>$request->last_name,
            'phone'=>$request->phone,
            'hire_date'=>$request->hire_date,
            'salary'=>$request->salary,
            'user_id'=>$user->id
        ]);

        $token=$user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token'=>$token,
            'token_type'=>'Bearer',
            'user'=>$user
        ], 201);
    }

    public function login(Request $request){
        $request->validate([
            'email'=>'required|string|email',
            'password'=>'required|string'
        ]);

        $user=User::where('email', $request->email)->first();

        if(!$user || !Hash::check($request->password, $user->password))
        {
            throw ValidationException::withMessages([
                'email'=>['Los datos son incorrectos']
            ]);
        }

        $token=$user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token'=>$token,
            'token_type'=>'Bearer',
            'user'=>$user
        ], 201);
    }

    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'mensaje'=>'Sesion cerrada correctamente'
        ], 201);
    }
}

<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'names' => 'required|string|max:255',
            'last_names' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'cod_oficina_tecnica' => 'required|integer',
            'cod_role' => 'required|string',
        ]);

        $user = User::create([
            'names' => $request->name,
            'last_names' => $request->last_names,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'provincia_oficina_tecnica' => $request->provincia_oficina_tecnica,
        ]);

        event(new Registered($user));

        // Auth::login($user);

        return redirect(route('dashboard', absolute: true));
    }
}

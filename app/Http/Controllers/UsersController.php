<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;


class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return inertia('Dashboard', [
            'message' => 'This is the Users Index',
            'listaUsuarios' => User::all()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Auth/Register');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'names' => 'required|string|max:255',
            'last_names' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|string|in:superadmin,admin,visitor',
            'provincia_oficina_tecnica' => 'required|string',
        ]);

        $user = User::create([
            'names' => $request->names,
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

    /**
     * Display the specified resource.
     */
    public function show(User $users)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $users)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $users)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $users)
    {
        //
    }
}

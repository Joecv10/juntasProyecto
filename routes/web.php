<?php

use App\Http\Controllers\UsersController;
use App\Http\Controllers\LugarController;
use App\Http\Controllers\JuntasRiegoController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard', [UsersController::class, 'index']);
// })->name('dashboard')
//     ->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/dashboard', [UsersController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});





Route::resource('users', UsersController::class)->middleware(['auth', 'verified']);

Route::resource('juntasRiego', JuntasRiegoController::class,)->middleware(['auth', 'verified']);

Route::get('/buscar-provincias', [LugarController::class, 'buscarProvincias'])->name('provincias.buscar');
Route::get('/buscar-cantones', [LugarController::class, 'buscarCantones'])->name('cantones.buscar');
Route::get('/buscar-parroquias', [LugarController::class, 'buscarParroquias'])->name('parroquias.buscar');
Route::get('/provincia-by-name', [LugarController::class, 'buscarProvinciaByName'])->name('provincia.byname');




require __DIR__ . '/auth.php';

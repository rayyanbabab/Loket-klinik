<?php

use App\Http\Controllers\DisplayController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Public Queue routes (Display TV & Kiosk Ambil Tiket)
Route::get('/queue/display', function () {
    return Inertia::render('queue/display');
})->name('queue.display');

Route::get('/queue/ticket', function () {
    return Inertia::render('queue/ticket');
})->name('queue.ticket');

// Queue Operator & Dashboard (requires auth)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/queue/management', function () {
        return Inertia::render('queue/management');
    })->name('queue.management');

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

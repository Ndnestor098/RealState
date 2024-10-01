<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FeatureController;
use App\Http\Controllers\HouseController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VisitController;
use App\Http\Middleware\EnsureAdmin;
use Illuminate\Support\Facades\Auth;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::controller(HouseController::class)->group(function () {
    Route::get('/houses', 'index')->name('houses');
    Route::post('/houses/create', 'create')->name('houses.create');
    Route::post('/houses/update/{house}', 'update')->name('houses.update');
    Route::delete('/houses/delete/{house_id}', 'delete')->name('houses.delete');
});

Route::controller(FeatureController::class)->group(function () {
    Route::get('/features', 'index')->name('features');
});

Route::controller(VisitController::class)->group(function () {
    Route::get('/visit', 'index')->name('visit')->middleware(['web', 'auth']);
    Route::put('/visit/pending/{visit}', 'markAsPending')->name('visit.mark.pending')->middleware(['web', 'auth']);
    Route::put('/visit/visited/{visit}', 'markAsVisited')->name('visit.mark.pending')->middleware(['web', 'auth']);
    Route::post('/visit/{house}', 'create')->name('visit.create');
    Route::delete('/visit/delete/{visit_id}', 'delete')->name('visit.delete')->middleware(['web', 'auth']);
});

Route::post('/login', [LoginController::class, 'login'])->middleware('web')->name('login');
Route::post('/logout', [LoginController::class, 'logout'])->middleware(['web', 'auth'])->name('logout');

Route::controller(UserController::class)->group(function () {
    Route::get('/users', 'index')->name('users');
    Route::post('/users/create', 'create')->name('users.create');
    Route::post('/users/update/{id}', 'update')->name('users.update');
    Route::delete('/users/delete/{id}', 'delete')->name('users.delete');
})->middleware(['web', 'auth', EnsureAdmin::class]);

Route::controller(NotificationController::class)->group(function () {
    Route::get('/notifications', 'index')->name('notifications');
    Route::post('/notifications/{notify}', 'markRead')->name('notifications.markAsRead');
    
})->middleware(['web', 'auth', EnsureAdmin::class]);

Route::middleware('web')->get('/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});

Route::middleware(['web', 'auth', EnsureAdmin::class])->get('/authorization', function () {
    return response()->json([
        'message' => 'Authorization Completed.',
        'user' => Auth::user(),
        'status' => 200
    ], 200);
});


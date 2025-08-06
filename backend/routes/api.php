<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ContactHistoryController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Contact routes
Route::prefix('contacts')->group(function () {
    Route::get('/', [ContactController::class, 'index']);
    Route::post('/', [ContactController::class, 'store']);
    Route::get('/stats', [ContactController::class, 'stats']);
    Route::get('/{contact}', [ContactController::class, 'show']);
    Route::put('/{contact}', [ContactController::class, 'update']);
    Route::delete('/{contact}', [ContactController::class, 'destroy']);
});

// Contact History routes
Route::prefix('contact-histories')->group(function () {
    Route::get('/', [ContactHistoryController::class, 'index']);
    Route::get('/actions', [ContactHistoryController::class, 'actions']);
    Route::get('/stats', [ContactHistoryController::class, 'stats']);
    Route::get('/{contactHistory}', [ContactHistoryController::class, 'show']);
    Route::get('/contact/{contact}', [ContactHistoryController::class, 'contactHistory']);
}); 

Route::get('/test', function() {
    return response()->json(['message' => 'API is working']);
});
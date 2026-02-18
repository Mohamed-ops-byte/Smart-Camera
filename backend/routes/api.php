<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\CameraController;
use App\Http\Controllers\API\PersonController;
use App\Http\Controllers\API\DetectionController;
use App\Http\Controllers\API\AlertController;
use App\Http\Controllers\API\SettingController;
use App\Http\Controllers\API\ScheduleController;

Route::middleware('api')->group(function () {
    // Cameras
    Route::apiResource('cameras', CameraController::class);
    
    // Persons
    Route::apiResource('persons', PersonController::class);
    Route::post('persons/{id}/faces', [PersonController::class, 'addFace']);
    
    // Detections
    Route::apiResource('detections', DetectionController::class, ['only' => ['index', 'store', 'show']]);
    Route::get('detections/statistics', [DetectionController::class, 'statistics']);
    
    // Alerts
    Route::apiResource('alerts', AlertController::class, ['only' => ['index', 'store', 'destroy']]);
    Route::post('alerts/{id}/acknowledge', [AlertController::class, 'acknowledge']);
    Route::get('alerts/unacknowledged', [AlertController::class, 'unacknowledged']);
    
    // Settings
    Route::get('settings', [SettingController::class, 'index']);
    Route::put('settings', [SettingController::class, 'update']);
    Route::post('settings/reset', [SettingController::class, 'reset']);
    
    // Schedules
    Route::apiResource('schedules', ScheduleController::class);
    Route::get('schedules/active', [ScheduleController::class, 'active']);
});

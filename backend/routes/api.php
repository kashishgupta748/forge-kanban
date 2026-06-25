<?php

use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\BoardController;
use App\Http\Controllers\Api\CardController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ListController;
use App\Http\Controllers\Api\MemberController;
use App\Http\Controllers\Api\TagController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Kanban API v1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // ── Dashboard ──────────────────────────────────────────────────────
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // ── Boards ─────────────────────────────────────────────────────────
    Route::get('/boards',         [BoardController::class, 'index']);
    Route::post('/boards',        [BoardController::class, 'store']);
    Route::get('/boards/{board}', [BoardController::class, 'show']);
    Route::put('/boards/{board}', [BoardController::class, 'update']);
    Route::delete('/boards/{board}', [BoardController::class, 'destroy']);

    // ── Lists (scoped to board) ─────────────────────────────────────────
    Route::get('/boards/{board}/lists',            [ListController::class, 'index']);
    Route::post('/boards/{board}/lists',           [ListController::class, 'store']);
    Route::put('/boards/{board}/lists/reorder',    [ListController::class, 'reorder']);
    Route::get('/boards/{board}/lists/{list}',     [ListController::class, 'show']);
    Route::put('/boards/{board}/lists/{list}',     [ListController::class, 'update']);
    Route::delete('/boards/{board}/lists/{list}',  [ListController::class, 'destroy']);

    // ── Cards (scoped to board + list) ─────────────────────────────────
    Route::get('/boards/{board}/lists/{list}/cards',  [CardController::class, 'index']);
    Route::post('/boards/{board}/lists/{list}/cards', [CardController::class, 'store']);

    // ── Cards (global) ─────────────────────────────────────────────────
    Route::get('/cards/{card}',    [CardController::class, 'show']);
    Route::put('/cards/{card}',    [CardController::class, 'update']);
    Route::delete('/cards/{card}', [CardController::class, 'destroy']);
    Route::put('/cards/{card}/move', [CardController::class, 'move']);

    // ── Tags (scoped to board) ─────────────────────────────────────────
    Route::get('/boards/{board}/tags',          [TagController::class, 'index']);
    Route::post('/boards/{board}/tags',         [TagController::class, 'store']);
    Route::put('/boards/{board}/tags/{tag}',    [TagController::class, 'update']);
    Route::delete('/boards/{board}/tags/{tag}', [TagController::class, 'destroy']);

    // ── Tag ↔ Card pivot ───────────────────────────────────────────────
    Route::post('/cards/{card}/tags/{tag}',   [TagController::class, 'attach']);
    Route::delete('/cards/{card}/tags/{tag}', [TagController::class, 'detach']);

    // ── Members ────────────────────────────────────────────────────────
    Route::get('/members',           [MemberController::class, 'index']);
    Route::post('/members',          [MemberController::class, 'store']);
    Route::get('/members/{member}',  [MemberController::class, 'show']);
    Route::put('/members/{member}',  [MemberController::class, 'update']);
    Route::delete('/members/{member}', [MemberController::class, 'destroy']);

    // ── Member ↔ Card pivot ────────────────────────────────────────────
    Route::post('/cards/{card}/members/{member}',   [MemberController::class, 'attach']);
    Route::delete('/cards/{card}/members/{member}', [MemberController::class, 'detach']);

    // ── Comments (scoped to card) ──────────────────────────────────────
    Route::get('/cards/{card}/comments',  [CommentController::class, 'index']);
    Route::post('/cards/{card}/comments', [CommentController::class, 'store']);
    Route::put('/comments/{comment}',     [CommentController::class, 'update']);
    Route::delete('/comments/{comment}',  [CommentController::class, 'destroy']);

    // ── Activities ─────────────────────────────────────────────────────
    Route::get('/boards/{board}/activities', [ActivityController::class, 'boardActivities']);
    Route::get('/cards/{card}/activities',   [ActivityController::class, 'cardActivities']);
});

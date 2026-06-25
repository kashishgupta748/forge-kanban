<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityResource;
use App\Http\Resources\BoardResource;
use App\Models\Activity;
use App\Models\Board;
use App\Models\Card;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    /**
     * GET /api/v1/dashboard
     * Returns a summary of the entire Kanban workspace.
     */
    public function index(): JsonResponse
    {
        $totalBoards = Board::where('is_archived', false)->count();
        $totalCards  = Card::where('is_archived', false)->count();

        $overdueCards = Card::where('is_archived', false)
            ->whereNotNull('due_date')
            ->where('due_date', '<', Carbon::now())
            ->count();

        $cardsDueToday = Card::where('is_archived', false)
            ->whereNotNull('due_date')
            ->whereDate('due_date', Carbon::today())
            ->count();

        $recentActivities = Activity::with(['board', 'card', 'member'])
            ->latest()
            ->limit(10)
            ->get();

        $boardsSummary = Board::where('is_archived', false)
            ->withCount(['lists'])
            ->with(['lists' => function ($q) {
                $q->withCount('cards');
            }])
            ->get()
            ->map(function (Board $board) {
                $cardCount = $board->lists->sum('cards_count');
                return [
                    'id'          => $board->id,
                    'name'        => $board->name,
                    'color'       => $board->color,
                    'lists_count' => $board->lists_count,
                    'cards_count' => $cardCount,
                ];
            });

        return response()->json([
            'data' => [
                'total_boards'       => $totalBoards,
                'total_cards'        => $totalCards,
                'overdue_cards'      => $overdueCards,
                'cards_due_today'    => $cardsDueToday,
                'recent_activities'  => ActivityResource::collection($recentActivities),
                'boards_summary'     => $boardsSummary,
            ],
        ]);
    }
}

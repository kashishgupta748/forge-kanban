<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityResource;
use App\Models\Board;
use App\Models\Card;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ActivityController extends Controller
{
    /**
     * GET /api/v1/boards/{board}/activities
     * Return latest 50 activities for a board.
     */
    public function boardActivities(Board $board): AnonymousResourceCollection
    {
        $activities = $board->activities()
            ->with(['member', 'card'])
            ->latest()
            ->limit(50)
            ->get();

        return ActivityResource::collection($activities);
    }

    /**
     * GET /api/v1/cards/{card}/activities
     * Return all activities for a specific card.
     */
    public function cardActivities(Card $card): AnonymousResourceCollection
    {
        $activities = $card->activities()
            ->with(['member', 'board'])
            ->latest()
            ->get();

        return ActivityResource::collection($activities);
    }
}

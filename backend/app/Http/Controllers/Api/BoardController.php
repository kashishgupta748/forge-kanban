<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BoardResource;
use App\Models\Board;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class BoardController extends Controller
{
    /**
     * GET /api/v1/boards
     * List all boards with list + card counts.
     */
    public function index(): AnonymousResourceCollection
    {
        $boards = Board::withCount(['lists'])
            ->with(['lists' => function ($q) {
                $q->withCount('cards');
            }])
            ->latest()
            ->get();

        return BoardResource::collection($boards);
    }

    /**
     * POST /api/v1/boards
     */
    public function store(Request $request): BoardResource
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'color'       => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'is_archived' => 'nullable|boolean',
        ]);

        $board = Board::create($validated);

        return new BoardResource($board);
    }

    /**
     * GET /api/v1/boards/{board}
     * Show a board with its lists, cards, tags and members.
     */
    public function show(Board $board): BoardResource
    {
        $board->load([
            'lists.cards.members',
            'lists.cards.tags',
            'tags',
        ]);

        return new BoardResource($board);
    }

    /**
     * PUT /api/v1/boards/{board}
     */
    public function update(Request $request, Board $board): BoardResource
    {
        $validated = $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'color'       => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'is_archived' => 'nullable|boolean',
        ]);

        $board->update($validated);

        return new BoardResource($board);
    }

    /**
     * DELETE /api/v1/boards/{board}
     */
    public function destroy(Board $board): JsonResponse
    {
        $board->delete();

        return response()->json(['message' => 'Board deleted successfully.'], 200);
    }
}

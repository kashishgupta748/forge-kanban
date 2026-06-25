<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CardResource;
use App\Models\Card;
use App\Models\KanbanList;
use App\Models\Board;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class CardController extends Controller
{
    /**
     * GET /api/v1/boards/{board}/lists/{list}/cards
     */
    public function index(Board $board, KanbanList $list): AnonymousResourceCollection
    {
        $this->ensureListBelongsToBoard($board, $list);

        $cards = $list->cards()
            ->with(['members', 'tags'])
            ->withCount(['comments', 'members'])
            ->orderBy('position')
            ->get();

        return CardResource::collection($cards);
    }

    /**
     * POST /api/v1/boards/{board}/lists/{list}/cards
     */
    public function store(Request $request, Board $board, KanbanList $list): CardResource
    {
        $this->ensureListBelongsToBoard($board, $list);

        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'position'    => 'nullable|integer|min:0',
            'due_date'    => 'nullable|date',
            'is_archived' => 'nullable|boolean',
        ]);

        if (! isset($validated['position'])) {
            $validated['position'] = $list->cards()->max('position') + 1;
        }

        $card = $list->cards()->create($validated);

        return new CardResource($card->load(['members', 'tags']));
    }

    /**
     * GET /api/v1/cards/{card}
     */
    public function show(Card $card): CardResource
    {
        $card->load([
            'members',
            'tags',
            'comments.member',
            'activities.member',
        ]);

        return new CardResource($card);
    }

    /**
     * PUT /api/v1/cards/{card}
     */
    public function update(Request $request, Card $card): CardResource
    {
        $validated = $request->validate([
            'title'       => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'position'    => 'nullable|integer|min:0',
            'due_date'    => 'nullable|date',
            'is_archived' => 'nullable|boolean',
            'list_id'     => 'nullable|integer|exists:lists,id',
        ]);

        $card->update($validated);

        return new CardResource($card->load(['members', 'tags']));
    }

    /**
     * DELETE /api/v1/cards/{card}
     */
    public function destroy(Card $card): JsonResponse
    {
        $card->delete();

        return response()->json(['message' => 'Card deleted successfully.'], 200);
    }

    /**
     * PUT /api/v1/cards/{card}/move
     * Move card to a different list and/or position.
     * Body: { "list_id": 2, "position": 0 }
     */
    public function move(Request $request, Card $card): CardResource
    {
        $validated = $request->validate([
            'list_id'  => 'required|integer|exists:lists,id',
            'position' => 'required|integer|min:0',
        ]);

        DB::transaction(function () use ($card, $validated) {
            $oldListId   = $card->list_id;
            $newListId   = $validated['list_id'];
            $newPosition = $validated['position'];

            if ($oldListId === $newListId) {
                // Reorder within the same list
                $oldPosition = $card->position;
                if ($newPosition < $oldPosition) {
                    Card::where('list_id', $oldListId)
                        ->where('position', '>=', $newPosition)
                        ->where('position', '<', $oldPosition)
                        ->where('id', '!=', $card->id)
                        ->increment('position');
                } else {
                    Card::where('list_id', $oldListId)
                        ->where('position', '>', $oldPosition)
                        ->where('position', '<=', $newPosition)
                        ->where('id', '!=', $card->id)
                        ->decrement('position');
                }
            } else {
                // Moving to another list — shift old list up, new list down
                Card::where('list_id', $oldListId)
                    ->where('position', '>', $card->position)
                    ->decrement('position');

                Card::where('list_id', $newListId)
                    ->where('position', '>=', $newPosition)
                    ->increment('position');
            }

            $card->update([
                'list_id'  => $newListId,
                'position' => $newPosition,
            ]);
        });

        return new CardResource($card->fresh()->load(['members', 'tags']));
    }

    /**
     * Ensure the given list belongs to the given board.
     */
    private function ensureListBelongsToBoard(Board $board, KanbanList $list): void
    {
        if ($list->board_id !== $board->id) {
            abort(404, 'List not found on this board.');
        }
    }
}

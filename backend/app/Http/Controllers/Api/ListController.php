<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ListResource;
use App\Models\Board;
use App\Models\KanbanList;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class ListController extends Controller
{
    /**
     * GET /api/v1/boards/{board}/lists
     */
    public function index(Board $board): AnonymousResourceCollection
    {
        $lists = $board->lists()->withCount('cards')->ordered()->get();

        return ListResource::collection($lists);
    }

    /**
     * POST /api/v1/boards/{board}/lists
     */
    public function store(Request $request, Board $board): ListResource
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'position'    => 'nullable|integer|min:0',
            'is_archived' => 'nullable|boolean',
        ]);

        // Default position to the end
        if (! isset($validated['position'])) {
            $validated['position'] = $board->lists()->max('position') + 1;
        }

        $list = $board->lists()->create($validated);

        return new ListResource($list);
    }

    /**
     * GET /api/v1/boards/{board}/lists/{list}
     */
    public function show(Board $board, KanbanList $list): ListResource
    {
        $this->ensureListBelongsToBoard($board, $list);

        $list->load('cards.members', 'cards.tags');

        return new ListResource($list);
    }

    /**
     * PUT /api/v1/boards/{board}/lists/{list}
     */
    public function update(Request $request, Board $board, KanbanList $list): ListResource
    {
        $this->ensureListBelongsToBoard($board, $list);

        $validated = $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'position'    => 'nullable|integer|min:0',
            'is_archived' => 'nullable|boolean',
        ]);

        $list->update($validated);

        return new ListResource($list);
    }

    /**
     * DELETE /api/v1/boards/{board}/lists/{list}
     */
    public function destroy(Board $board, KanbanList $list): JsonResponse
    {
        $this->ensureListBelongsToBoard($board, $list);

        $list->delete();

        return response()->json(['message' => 'List deleted successfully.'], 200);
    }

    /**
     * PUT /api/v1/boards/{board}/lists/reorder
     * Accepts: { "lists": [{"id": 1, "position": 0}, ...] }
     */
    public function reorder(Request $request, Board $board): JsonResponse
    {
        $validated = $request->validate([
            'lists'            => 'required|array',
            'lists.*.id'       => 'required|integer|exists:lists,id',
            'lists.*.position' => 'required|integer|min:0',
        ]);

        DB::transaction(function () use ($validated, $board) {
            foreach ($validated['lists'] as $item) {
                KanbanList::where('id', $item['id'])
                    ->where('board_id', $board->id)
                    ->update(['position' => $item['position']]);
            }
        });

        $lists = $board->lists()->withCount('cards')->ordered()->get();

        return response()->json([
            'message' => 'Lists reordered successfully.',
            'data'    => ListResource::collection($lists),
        ]);
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

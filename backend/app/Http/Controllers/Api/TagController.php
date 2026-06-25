<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TagResource;
use App\Models\Board;
use App\Models\Card;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TagController extends Controller
{
    /**
     * GET /api/v1/boards/{board}/tags
     */
    public function index(Board $board): AnonymousResourceCollection
    {
        return TagResource::collection($board->tags()->orderBy('name')->get());
    }

    /**
     * POST /api/v1/boards/{board}/tags
     */
    public function store(Request $request, Board $board): TagResource
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:100',
            'color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
        ]);

        $tag = $board->tags()->create($validated);

        return new TagResource($tag);
    }

    /**
     * PUT /api/v1/boards/{board}/tags/{tag}
     */
    public function update(Request $request, Board $board, Tag $tag): TagResource
    {
        $this->ensureTagBelongsToBoard($board, $tag);

        $validated = $request->validate([
            'name'  => 'sometimes|required|string|max:100',
            'color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
        ]);

        $tag->update($validated);

        return new TagResource($tag);
    }

    /**
     * DELETE /api/v1/boards/{board}/tags/{tag}
     */
    public function destroy(Board $board, Tag $tag): JsonResponse
    {
        $this->ensureTagBelongsToBoard($board, $tag);

        $tag->delete();

        return response()->json(['message' => 'Tag deleted successfully.'], 200);
    }

    /**
     * POST /api/v1/cards/{card}/tags/{tag}
     * Attach a tag to a card.
     */
    public function attach(Card $card, Tag $tag): JsonResponse
    {
        $card->tags()->syncWithoutDetaching([$tag->id]);

        return response()->json(['message' => 'Tag attached to card.'], 200);
    }

    /**
     * DELETE /api/v1/cards/{card}/tags/{tag}
     * Detach a tag from a card.
     */
    public function detach(Card $card, Tag $tag): JsonResponse
    {
        $card->tags()->detach($tag->id);

        return response()->json(['message' => 'Tag detached from card.'], 200);
    }

    private function ensureTagBelongsToBoard(Board $board, Tag $tag): void
    {
        if ($tag->board_id !== $board->id) {
            abort(404, 'Tag not found on this board.');
        }
    }
}

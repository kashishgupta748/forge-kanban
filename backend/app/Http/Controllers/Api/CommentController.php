<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CommentResource;
use App\Models\Card;
use App\Models\Comment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CommentController extends Controller
{
    /**
     * GET /api/v1/cards/{card}/comments
     */
    public function index(Card $card): AnonymousResourceCollection
    {
        $comments = $card->comments()->with('member')->latest()->get();

        return CommentResource::collection($comments);
    }

    /**
     * POST /api/v1/cards/{card}/comments
     */
    public function store(Request $request, Card $card): CommentResource
    {
        $validated = $request->validate([
            'member_id' => 'required|integer|exists:members,id',
            'body'      => 'required|string|max:5000',
        ]);

        $comment = $card->comments()->create($validated);
        $comment->load('member');

        return new CommentResource($comment);
    }

    /**
     * PUT /api/v1/comments/{comment}
     */
    public function update(Request $request, Comment $comment): CommentResource
    {
        $validated = $request->validate([
            'body' => 'required|string|max:5000',
        ]);

        $comment->update($validated);
        $comment->load('member');

        return new CommentResource($comment);
    }

    /**
     * DELETE /api/v1/comments/{comment}
     */
    public function destroy(Comment $comment): JsonResponse
    {
        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully.'], 200);
    }
}

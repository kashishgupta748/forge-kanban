<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MemberResource;
use App\Models\Card;
use App\Models\Member;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MemberController extends Controller
{
    /**
     * GET /api/v1/members
     */
    public function index(): AnonymousResourceCollection
    {
        return MemberResource::collection(Member::orderBy('name')->get());
    }

    /**
     * POST /api/v1/members
     */
    public function store(Request $request): MemberResource
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|email|unique:members,email',
            'avatar_url' => 'nullable|url',
            'role'       => 'nullable|in:admin,member',
        ]);

        $member = Member::create($validated);

        return new MemberResource($member);
    }

    /**
     * GET /api/v1/members/{member}
     */
    public function show(Member $member): MemberResource
    {
        return new MemberResource($member);
    }

    /**
     * PUT /api/v1/members/{member}
     */
    public function update(Request $request, Member $member): MemberResource
    {
        $validated = $request->validate([
            'name'       => 'sometimes|required|string|max:255',
            'email'      => 'sometimes|required|email|unique:members,email,' . $member->id,
            'avatar_url' => 'nullable|url',
            'role'       => 'nullable|in:admin,member',
        ]);

        $member->update($validated);

        return new MemberResource($member);
    }

    /**
     * DELETE /api/v1/members/{member}
     */
    public function destroy(Member $member): JsonResponse
    {
        $member->delete();

        return response()->json(['message' => 'Member deleted successfully.'], 200);
    }

    /**
     * POST /api/v1/cards/{card}/members/{member}
     * Assign a member to a card.
     */
    public function attach(Card $card, Member $member): JsonResponse
    {
        $card->members()->syncWithoutDetaching([$member->id]);

        return response()->json(['message' => 'Member attached to card.'], 200);
    }

    /**
     * DELETE /api/v1/cards/{card}/members/{member}
     * Remove a member from a card.
     */
    public function detach(Card $card, Member $member): JsonResponse
    {
        $card->members()->detach($member->id);

        return response()->json(['message' => 'Member detached from card.'], 200);
    }
}

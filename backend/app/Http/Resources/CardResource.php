<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CardResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'list_id'     => $this->list_id,
            'title'       => $this->title,
            'description' => $this->description,
            'position'    => $this->position,
            'due_date'    => $this->due_date?->toISOString(),
            'is_archived' => $this->is_archived,
            'is_overdue'  => $this->is_overdue,
            'created_at'  => $this->created_at?->toISOString(),
            'updated_at'  => $this->updated_at?->toISOString(),
            'members'     => MemberResource::collection($this->whenLoaded('members')),
            'tags'        => TagResource::collection($this->whenLoaded('tags')),
            'comments'    => CommentResource::collection($this->whenLoaded('comments')),
            'activities'  => ActivityResource::collection($this->whenLoaded('activities')),
            'members_count' => $this->when(isset($this->members_count), fn () => $this->members_count),
            'comments_count' => $this->when(isset($this->comments_count), fn () => $this->comments_count),
        ];
    }
}

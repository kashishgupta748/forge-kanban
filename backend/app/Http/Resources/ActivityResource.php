<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'board_id'    => $this->board_id,
            'card_id'     => $this->card_id,
            'member_id'   => $this->member_id,
            'type'        => $this->type,
            'description' => $this->description,
            'metadata'    => $this->metadata,
            'created_at'  => $this->created_at?->toISOString(),
            'updated_at'  => $this->updated_at?->toISOString(),
            'board'       => new BoardResource($this->whenLoaded('board')),
            'card'        => new CardResource($this->whenLoaded('card')),
            'member'      => new MemberResource($this->whenLoaded('member')),
        ];
    }
}

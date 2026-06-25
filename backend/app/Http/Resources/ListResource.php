<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ListResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'board_id'    => $this->board_id,
            'name'        => $this->name,
            'position'    => $this->position,
            'is_archived' => $this->is_archived,
            'created_at'  => $this->created_at?->toISOString(),
            'updated_at'  => $this->updated_at?->toISOString(),
            'cards'       => CardResource::collection($this->whenLoaded('cards')),
            'cards_count' => $this->when(
                isset($this->cards_count),
                fn () => $this->cards_count
            ),
        ];
    }
}

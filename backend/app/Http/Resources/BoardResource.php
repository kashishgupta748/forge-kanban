<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BoardResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'description' => $this->description,
            'color'       => $this->color,
            'is_archived' => $this->is_archived,
            'created_at'  => $this->created_at?->toISOString(),
            'updated_at'  => $this->updated_at?->toISOString(),
            'lists'       => ListResource::collection($this->whenLoaded('lists')),
            'tags'        => TagResource::collection($this->whenLoaded('tags')),
            'activities'  => ActivityResource::collection($this->whenLoaded('activities')),
        ];
    }
}

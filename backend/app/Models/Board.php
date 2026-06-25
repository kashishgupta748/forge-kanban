<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Board extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'color',
        'is_archived',
    ];

    protected $casts = [
        'is_archived' => 'bool',
    ];

    /**
     * Get all lists for this board (ordered by position).
     */
    public function lists(): HasMany
    {
        return $this->hasMany(KanbanList::class, 'board_id')->orderBy('position');
    }

    /**
     * Get all activities for this board.
     */
    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class, 'board_id')->latest();
    }

    /**
     * Get all tags for this board.
     */
    public function tags(): HasMany
    {
        return $this->hasMany(Tag::class, 'board_id');
    }
}

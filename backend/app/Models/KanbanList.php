<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KanbanList extends Model
{
    use HasFactory;

    protected $table = 'lists';

    protected $fillable = [
        'board_id',
        'name',
        'position',
        'is_archived',
    ];

    protected $casts = [
        'is_archived' => 'bool',
        'position'    => 'int',
    ];

    /**
     * The board this list belongs to.
     */
    public function board(): BelongsTo
    {
        return $this->belongsTo(Board::class);
    }

    /**
     * Cards within this list.
     */
    public function cards(): HasMany
    {
        return $this->hasMany(Card::class, 'list_id')->orderBy('position');
    }

    /**
     * Scope: order by position ascending.
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('position');
    }
}

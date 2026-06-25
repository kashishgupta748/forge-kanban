<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = [
        'board_id',
        'name',
        'color',
    ];

    /**
     * The board this tag belongs to.
     */
    public function board(): BelongsTo
    {
        return $this->belongsTo(Board::class);
    }

    /**
     * Cards that have this tag.
     */
    public function cards(): BelongsToMany
    {
        return $this->belongsToMany(Card::class, 'card_tag');
    }
}

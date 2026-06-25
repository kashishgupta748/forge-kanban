<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Card extends Model
{
    use HasFactory;

    protected $fillable = [
        'list_id',
        'title',
        'description',
        'position',
        'due_date',
        'is_archived',
    ];

    protected $casts = [
        'due_date'    => 'datetime',
        'is_archived' => 'bool',
        'position'    => 'int',
    ];

    /**
     * The list this card belongs to.
     */
    public function kanbanList(): BelongsTo
    {
        return $this->belongsTo(KanbanList::class, 'list_id');
    }

    /**
     * Members assigned to this card.
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(Member::class, 'card_member');
    }

    /**
     * Tags attached to this card.
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'card_tag');
    }

    /**
     * Comments on this card.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class, 'card_id')->latest();
    }

    /**
     * Activities related to this card.
     */
    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class, 'card_id')->latest();
    }

    /**
     * Accessor: is this card overdue?
     */
    protected function isOverdue(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (is_null($this->due_date)) {
                    return false;
                }
                return $this->due_date->isPast() && ! $this->is_archived;
            }
        );
    }

    /**
     * Append the is_overdue accessor.
     */
    protected $appends = ['is_overdue'];
}

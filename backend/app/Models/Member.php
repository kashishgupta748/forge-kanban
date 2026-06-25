<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Member extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'avatar_url',
        'role',
    ];

    /**
     * Cards this member is assigned to.
     */
    public function cards(): BelongsToMany
    {
        return $this->belongsToMany(Card::class, 'card_member');
    }
}

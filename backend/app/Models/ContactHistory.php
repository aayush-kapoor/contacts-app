<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactHistory extends Model
{
    protected $fillable = [
        'contact_id',
        'action',
        'field',
        'old_value',
        'new_value',
        'user_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the contact that owns this history entry
     */
    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    /**
     * Action constants
     */
    const ACTION_CREATED = 'created';
    const ACTION_UPDATED = 'updated';
    const ACTION_DELETED = 'deleted';

    /**
     * Get all available actions
     */
    public static function getActions(): array
    {
        return [
            self::ACTION_CREATED,
            self::ACTION_UPDATED,
            self::ACTION_DELETED,
        ];
    }

    /**
     * Create a history entry for contact creation
     */
    public static function logCreation(Contact $contact, string $userId = 'system'): self
    {
        return self::create([
            'contact_id' => $contact->id,
            'action' => self::ACTION_CREATED,
            'field' => null,
            'old_value' => null,
            'new_value' => null,
            'user_id' => $userId,
        ]);
    }

    /**
     * Create a history entry for contact update
     */
    public static function logUpdate(Contact $contact, string $field, $oldValue, $newValue, string $userId = 'system'): self
    {
        return self::create([
            'contact_id' => $contact->id,
            'action' => self::ACTION_UPDATED,
            'field' => $field,
            'old_value' => $oldValue,
            'new_value' => $newValue,
            'user_id' => $userId,
        ]);
    }

    /**
     * Create a history entry for contact deletion
     */
    public static function logDeletion(Contact $contact, string $userId = 'system'): self
    {
        return self::create([
            'contact_id' => $contact->id,
            'action' => self::ACTION_DELETED,
            'field' => null,
            'old_value' => null,
            'new_value' => null,
            'user_id' => $userId,
        ]);
    }
}

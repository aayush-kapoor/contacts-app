<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Validation\Rule;

class Contact extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the contact's full name
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    /**
     * Get the contact histories for this contact
     */
    public function histories(): HasMany
    {
        return $this->hasMany(ContactHistory::class);
    }

    /**
     * Validation rules for creating a contact
     */
    public static function getValidationRules(?int $contactId = null): array
    {
        $emailRule = Rule::unique('contacts', 'email');
        
        if ($contactId) {
            $emailRule->ignore($contactId);
        }

        return [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', $emailRule],
            'phone' => 'required|string|max:255',
        ];
    }

    /**
     * Validation messages
     */
    public static function getValidationMessages(): array
    {
        return [
            'first_name.required' => 'First name is required',
            'last_name.required' => 'Last name is required',
            'email.required' => 'Email is required',
            'email.email' => 'Email format is invalid',
            'email.unique' => 'This email is already registered',
            'phone.required' => 'Phone number is required',
        ];
    }
}

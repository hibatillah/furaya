<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Models\Guests\Guest;
use App\Models\Managements\Employee;
use App\Models\Reservations\Reservation;
use App\Models\Reservations\ReservationGuest;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /** table relations */
    public function employee()
    {
        return $this->hasOne(Employee::class);
    }

    public function guest()
    {
        return $this->hasOne(Guest::class);
    }

    public function reservations()
    {
        return $this->hasManyThrough(
            Reservation::class,
            ReservationGuest::class,
            'guest_id',          // foreign key on ReservationGuest
            'id',                // foreign key on Reservation
            'guest.id',          // local key on Guest (via hasOne)
            'reservation_id'     // local key on ReservationGuest
        );
    }
}

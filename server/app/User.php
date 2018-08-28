<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\DB;

class User extends Authenticatable
{
    protected $table = 'users';

    protected $fillable  = [
        'id',
        'name',
        'email',
        'password',
        'google_id',
        'user_type',
        'google_admin'
    ];

    protected $hidden = [
        'password',
        'remember_token'
    ];

    public function student(){
        return $this->hasMany('App\Student');
    }

    public function getAuthIdentifierName()
    {
        return 'id';
    }
}

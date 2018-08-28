<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $table = 'students';

    protected $fillable  = [
        'id',
        'user_id',
        'semester',
        'name',
        'email',
        'cgu',
        'matricula',
        'accumulated_hours'
    ];

    public function user(){
        return $this->belongsTo('App\User', 'id', 'user_id');
    }
}

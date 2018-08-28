<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Ata extends Model
{
    protected $table = 'ata';

    protected $fillable  = [
        'id',
        'year',
        'semester',
        'user_id'
    ];
}

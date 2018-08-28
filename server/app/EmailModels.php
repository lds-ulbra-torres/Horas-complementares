<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EmailModels extends Model
{
    protected $table = 'email_models';

    protected $fillable  = [
        'id',
        'email'
    ];
}

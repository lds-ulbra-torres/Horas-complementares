<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class GroupRule extends Model
{
    protected $table = 'group_rule';

    protected $fillable  = [
        'id',
        'name',
        'max_hours'
    ];
}

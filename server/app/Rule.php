<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Rule extends Model
{
    protected $table = 'rules';

    protected $fillable  = [
        'id',
        'classification',
        'activity',
        'percentage',
        'group_id'
    ];
}

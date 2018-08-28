<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    protected $table = 'certificates';

    protected $fillable  = [
        'id',
        'student_id',
        'rule_id',
        'group_id',
        'event',
        'date_event',
        'institution',
        'ch',
        'accumulated_ch',
        'status',
        'file_url',
        'full'
    ];
}

<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AtaHasStudents extends Model
{
    protected $table = 'ata_has_students';

    protected $fillable  = [
        'id',
        'student_id',
        'ata_id',
        'name',
        'matricula',
        'cgu',
        'hours',
        'status'
    ];
}

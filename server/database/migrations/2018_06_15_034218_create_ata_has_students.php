<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAtaHasStudents extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ata_has_students', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('student_id');
            $table->unsignedInteger('ata_id');
            $table->string('matricula')->nullable();
            $table->string('name')->nullable();
            $table->string('hours')->nullable();
            $table->string('status')->nullable();

            $table->foreign('student_id')
                ->references('id')->on('students');

            $table->foreign('ata_id')
                ->references('id')->on('ata');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ata_has_students');
    }
}

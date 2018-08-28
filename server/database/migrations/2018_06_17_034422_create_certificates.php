<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCertificates extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('certificates', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('student_id');
            $table->unsignedInteger('admin_id')->nullable();
            $table->unsignedInteger('rule_id')->nullable();
            $table->unsignedInteger('group_id')->nullable();
            $table->string('event')->nullable();
            $table->date('date_event')->nullable();
            $table->string('institution')->nullable();
            $table->string('ch')->nullable();
            $table->integer('accumulated_ch')->nullable();
            $table->string('packed_hours')->nullable();
            $table->integer('status');
            $table->text('file_url');
            $table->text('description')->nullable();
            $table->integer('full')->default(0);

            $table->foreign('student_id')
                ->references('id')->on('students')
                ->onDelete('cascade');

            $table->foreign('admin_id')
                ->references('id')->on('users');
                
            $table->foreign('rule_id')
                ->references('id')->on('rules');

            $table->foreign('group_id')
                ->references('id')->on('group_rule');
                
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
        Schema::dropIfExists('certificates');
    }
}

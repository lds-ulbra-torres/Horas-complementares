<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
//Route::get('ata-pdf', 'AtaController@generatePdf');
Route::group(['middleware' => 'key'], function(){

    Route::post('auth/login', 'AuthController@authenticate');

    Route::post('auth/login/google', 'AuthController@google');
    
    Route::get('auth/info', 'AuthController@info');

    // ADMINISTRATOR ROUTES
    Route::group(['middleware' => 'admin'], function(){
        //Route::get('update-hours', 'CertificateController@updateHours');
        /** ADMIN */
        Route::post('auth/admin', 'AuthController@createAdmin');
        Route::post('admin/create', 'AuthController@completeCreateAdmin');
        /** */
        /** GROUPES RULES */
        Route::get('groups', 'RuleController@getAllGroups');
        Route::post('group', 'RuleController@createGroup');
        Route::post('group-delete/{id}', 'RuleController@deleteGroup');
        /** */

        /** RULES */
        Route::get('rules', 'RuleController@getAll');
        Route::get('rule/{id}', 'RuleController@get');
        Route::post('rule', 'RuleController@create');
       // Route::put('rules/{id}', 'RuleController@update');
        Route::post('rule-delete/{id}', 'RuleController@delete');
        /** */

        /** STUDENTS */
        Route::get('students', 'StudentController@getAll');
        Route::get('student/{id}', 'StudentController@getById');
        /** **/

        /** CERTIFICATES */
        Route::get('certificates/all', 'CertificateController@getAll');
        Route::get('certificates/student/{id}', 'CertificateController@getByStudent');
        Route::get('certificate/{id}/student/{student}', 'CertificateController@getById');

        Route::post('certificate/avaliation/{id}', 'CertificateController@Avaliation');
        /** **/

        /** ATA */
        Route::get('atas', 'AtaController@getAll');
        Route::get('ata/{id}', 'AtaController@getById');
        Route::post('ata', 'AtaController@create');
        Route::post('ata-delete/{id}', 'AtaController@delete');
        /** */

        /** EMAIL MODELS */
            Route::get('emails', 'EmailModelsController@getAll');
            Route::post('email/model', 'EmailModelsController@create');
            Route::post('email-delete/{id}', 'EmailModelsController@delete');
        /** */
    });

    Route::group(['middleware' => 'student'], function(){
        /** */
        Route::get('total-hours', 'StudentController@getTotalHours');
        /** */
        /** REGISTER */
        Route::post('register', 'StudentController@completeRegister');
        /** */
        /** CERTIFICATES */
        Route::post('certificate', 'CertificateController@create');
        Route::get('certificates', 'CertificateController@getByStudent');
        Route::get('certificate/{id}', 'CertificateController@getById');
        Route::post('certificate-delete/{id}', 'CertificateController@remove');
        Route::post('certificate/{id}', 'CertificateController@update');
        /** **/

    });
    
});

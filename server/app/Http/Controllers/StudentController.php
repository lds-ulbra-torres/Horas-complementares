<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use App\Student;
use App\User;
use App\Certificate;
use App\Http\Requests\CompleteRegisterRequest;
use JWTFactory;
use JWTAuth;

class StudentController extends Controller
{
    public function getAll(){
      	$students = User::join('students', 'users.id', '=', 'students.user_id')
      	->where('users.user_type', 2)->get();

        return response()->json(['students' => $students, 'count' => count($students)], 200);
    }

    public function getById($id){
      	$students = User::join('students', 'users.id', '=', 'students.user_id')
      	->where('users.user_type', 2)
      	->where('students.id', $id)->first();

      	if(!$students){
      		return response()->json(['message' => 'Aluno não encontrado'], 404);
      	}

        return response()->json(['student' => $students], 200);
    }

    public function getTotalHours(){
        $user = JWTAuth::parseToken()->authenticate();
        $student = Student::where('user_id', $user->id)->first();
        
        return response()->json(['total_hours' => $student->accumulated_hours], 200);

    }

    public function completeRegister(CompleteRegisterRequest $request){
       $user = JWTAuth::parseToken()->authenticate();
       $student = Student::where('user_id', $user->id)->first();

       $student->cgu = $request->cgu;
       $student->matricula = $request->matricula;

       $student->save();

       return response()->json(['message' => 'Dados salvos com sucesso'], 200);
    }
}

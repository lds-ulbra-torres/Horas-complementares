<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Ata;
use App\AtaHasStudents;
use Response;
use App\User;
use JWTFactory;
use JWTAuth;
use App\Http\Requests\AtaRequest;

class AtaController extends Controller
{
    public function getAll(){
        $ata = Ata::orderByDesc('id')->get();

        return response()->json(['atas' => $ata], 200);
    }

    public function getById($id){
        $ata = Ata::where('id', $id)->first();

        $students = AtaHasStudents::join('students', 'students.id', '=', 'ata_has_students.student_id')
            ->join('users', 'users.id', '=', 'students.user_id')
            ->where('ata_has_students.ata_id', $id)
            ->select('users.name', 'ata_has_students.status', 'ata_has_students.matricula', 'ata_has_students.hours')
            ->get();

        $ata->students = $students;    

        return response()->json(['atas' => $ata], 200);
    }

    public function create(AtaRequest $request){
        $user = JWTAuth::parseToken()->authenticate();

        $ata = Ata::create([
            'user_id' => $user->id,
            'year' => $request->year,
            'semester' => $request->semester
        ]);
        if(count($request->students) <= 0){
            return response()->json(['message' => 'Nenhum aluno encontrado'], 400);
        }
        if($request->students){
            foreach ($request->students as $key => $value) {
                AtaHasStudents::create([
                    'ata_id' => $ata->id,
                    'student_id' => $value['id'],
                    'name' => $value['name'],
                    'matricula' => $value['matricula'],
                    'status' => $value['status'],
                    'hours' => $value['accumulated_hours']
                ]);
            }
        }else{
            return response()->json(['message' => 'Nenhum aluno encontrado'], 400);
        }

        return response()->json([$ata], 200);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Certificate;
use App\Http\Requests\CertificateRequest;
use App\Http\Requests\CertificateAvaliationRequest;
use App\User;
use App\Student;
use App\Rule;
use JWTFactory;
use JWTAuth;
use Illuminate\Support\Facades\Storage;
use Mail;

class CertificateController extends Controller
{
    private $url = 'http://localhost:8000/';
    public function create(CertificateRequest $request){
        $user = JWTAuth::parseToken()->authenticate();
        $student = Student::where('user_id', $user->id)->first();

        $file = $request->file('certificate_file');
        $name = time().'.'.$file->getClientOriginalExtension();
        $destinationPath = public_path('/images/'.$user->email);
        $file->move($destinationPath, $name);

        $certificate = Certificate::create([
            'student_id' => $student->id,
            'event' => $request->event,
            'date_event' => $request->date_event,
            'institution' => $request->institution,
            'ch' => $request->ch,
            'status' => 0,
            'file_url' => $this->url.'images/'.$user->email.'/'.$name
        ]);
        
        return response()->json([$certificate], 200);
    }


    public function getAll(Request $request){
            $certificates = Certificate::join('students', 'students.id', '=', 'certificates.student_id')
            ->join('users', 'users.id', '=', 'students.user_id')
            ->where('certificates.status', $request->query('status'))
            ->select('students.id as student_id', 'certificates.id as certificate_id', 'users.name', 'certificates.created_at')->get();

            return response()->json(['certificates' => $certificates, 'count' => count($certificates)], 200);
    }

    public function getByStudent(Request $request, $id = null){
        if($id){
            $certificates = Certificate::where('student_id', $id)->get();
            return response()->json(['certificates' => $certificates, 'count' => count($certificates)], 200);
        }else{
            $user = JWTAuth::parseToken()->authenticate();
            $student = Student::where('user_id', $user->id)->first();
            if($request->query('status') == '0' || $request->query('status') == '1' || $request->query('status') == '2'){
                $certificates = Certificate::where('student_id', $student->id)
                ->where('status', $request->query('status'))->orderByDesc('id')->paginate(15);
                return response()->json(['certificates' => $certificates, 'count' => count($certificates)], 200);
            }else{
                $certificates = Certificate::where('student_id', $student->id)
                ->orderByDesc('id')->paginate(15);
                return response()->json(['certificates' => $certificates, 'count' => count($certificates)], 200);
            }

        }
    }

    public function getById($id, $student = null){
        if($student){
            $certificate = Certificate::where('student_id', $student)
            ->where('id', $id)->first();
            return response()->json(['certificate' => $certificate], 200);
        }else{
            $user = JWTAuth::parseToken()->authenticate();
            $studentToken = Student::where('user_id', $user->id)->first();

             $certificate = Certificate::leftJoin('users', 'users.id', '=', 'certificates.admin_id')
             ->where('certificates.student_id', $studentToken->id)
            ->where('certificates.id', $id)
            ->select('certificates.*', 'users.name')->first();
            return response()->json(['certificate' => $certificate], 200);
        }
    }

    public function Avaliation(CertificateAvaliationRequest $request, $id){
        $user = JWTAuth::parseToken()->authenticate();
        if(!$user){
            return response()->json(['message' => 'Não foi possível recuperar o administrador'], 400);
        }

        $certificate = Certificate::where('id', $id)->first();
        if(!$certificate){
            return response()->json(['message' => 'Certificado não encontrado'], 404);
        }

        $studentMail = Student::join('users', 'users.id', '=', 'students.user_id')
            ->where('students.id', $certificate->student_id)->select('users.email as email', 'users.name as name')->first();

        if($request->status == 1){
            if(!$request->rule){
                return response()->json(['message' => 'Código de classificação não encontrado'], 400);
            }

            $group = Rule::join('group_rule', 'group_rule.id', '=', 'rules.group_id')
            ->where('rules.id', $request->rule)->select('rules.percentage','group_rule.id', 'group_rule.max_hours')->first();
            if(!$group){
                return response()->json(['message' => 'Código de classificação não encontrado'], 400);
            }

        
            $certificate->rule_id = $request->rule;
            $certificate->group_id = $group->id;

            $certificates = Certificate::where('student_id', $certificate->student_id)
            ->where('status', 1)
            ->where('group_id', $group->id)->get();

            
            $packed_hours = 0;
            if($certificates){
                foreach ($certificates as $key => $value) {
                    $packed_hours  = $packed_hours + (int)$value->accumulated_ch;      
                }        
            }
            if($packed_hours >= $group->max_hours){
                $certificate->full = 1;
                $certificate->admin_id = $user->id;
                $certificate->event = $request->event;
                $certificate->institution = $request->institution;
                $certificate->date_event = $request->date_event;
                $certificate->ch = $request->ch;
                $certificate->accumulated_ch = 0;
                $certificate->status = $request->status;
                $certificate->description = $request->description;

                $certificate->save();

                $data = array('name'=>$studentMail->name, 'event' => $certificate->event, 'status' => 1);

                Mail::send('emails.certificate', $data, function($message) use ($studentMail) {
                    $message->to($studentMail->email, $studentMail->name)
                    ->subject('Seu certificado foi avaliado');
                });

                return response()->json(['message' => 'Certificado avaliado com sucesso.'], 200);
            }else{
                $student = Student::where('id', $certificate->student_id)->first();
                $rest = $group->max_hours - $packed_hours;

                $ch_converted = (int)$request->ch * ((int)$group->percentage/100);

                if($rest >= $ch_converted){
                    $certificate->accumulated_ch = $ch_converted;
                    $student->accumulated_hours = $student->accumulated_hours + $ch_converted;
                }else{
                    $certificate->accumulated_ch = $rest;
                    $student->accumulated_hours = $student->accumulated_hours + $rest;
                    //$certificate->full = 1;
                }
            }
                $certificate->admin_id = $user->id;
                $certificate->event = $request->event;
                $certificate->institution = $request->institution;
                $certificate->date_event = $request->date_event;
                $certificate->ch = $request->ch;
                $certificate->status = $request->status;
                $certificate->description = $request->description;

                $certificate->save();
                $student->save();
                $data = array('name'=>$studentMail->name, 'event' => $certificate->event, 'status' => 1);

                Mail::send('emails.certificate', $data, function($message)  use ($studentMail) {
                    $message->to($studentMail->email, $studentMail->name)
                    ->subject('Seu certificado foi avaliado');
                });

                return response()->json(['message' => 'Certificado avaliado com sucesso.'], 200);
        }

        $certificate->admin_id = $user->id;
        $certificate->event = $request->event;
        $certificate->institution = $request->institution;
        $certificate->date_event = $request->date_event;
        $certificate->ch = $request->ch;
        $certificate->status = $request->status;
        $certificate->description = $request->description;

        $certificate->save();
        $data = array('name'=>$studentMail->name, 'event' => $certificate->event, 'status' => 2);

        Mail::send('emails.certificate', $data, function($message) use ($studentMail) {
            $message->to($studentMail->email, $studentMail->name)
            ->subject('Seu certificado foi avaliado');
        });
        return response()->json(['message' => 'Certificado avaliado com sucesso.'], 200);
    }

    public function update(Request $request, $id){
        $user = JWTAuth::parseToken()->authenticate();
        $student = Student::where('user_id', $user->id)->first();

        $certificate = Certificate::where('id', $id)
            ->where('status', '!=', 1)
            ->where('student_id', $student->id)
            ->first();

        if(!$certificate){
            return response()->json(['message' => 'Certificado não encontrado'], 404);
        }

        if($request->file('certificate_file')){
            $file = $request->file('certificate_file');
            $name = time().'.'.$file->getClientOriginalExtension();
            $destinationPath = public_path('/images/'.$user->email);
            $file->move($destinationPath, $name);

            $certificate->file_url = $this->url.'images/'.$user->email.'/'.$name;
        }else{
            $certificate->file_url = $request->file_url;
        }

        $certificate->event = $request->event;
        $certificate->institution = $request->institution;
        $certificate->date_event = $request->date_event;
        $certificate->ch = $request->ch;
        $certificate->status = 0;

        $certificate->save();

        return response()->json([$certificate], 200);
    }

    public function remove($id){
        $user = JWTAuth::parseToken()->authenticate();
        $student = Student::where('user_id', $user->id)->first();

        $certificate = Certificate::where('id', $id)
            ->where('status', 2)
            ->where('student_id', $student->id)
            ->first();

        if(!$certificate){
            return response()->json(['message' => 'Certificado não encontrado'], 404);
        }

        $certificate->delete();

        return response()->json(['message' => 'Certificado deletado'], 200);
    }

    /*public function updateHours(){
        $students = Student::join('users', 'users.id', 'students.user_id')
        ->select('students.id', 'users.name')->get();
        $certificates = array();
        foreach ($students as $key => $student) {
            $certificate = Certificate::where('student_id', $student->id)->where('accumulated_ch', '>', 0)->select('accumulated_ch')->get();
            $sun = 0;
            foreach ($certificate as $key => $c) {
                $sun = $sun + $c->accumulated_ch;
            }
            $s = Student::where('id', $student->id)->first();
            $s->accumulated_hours = $sun;
            $s->save();
        }

        return respnse()->json(['message' => 'Horas atualizadas com sucesso'], 200);
    }*/

}

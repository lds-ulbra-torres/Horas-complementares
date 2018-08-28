<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\AuthRequest;
use App\Http\Requests\CreateAdminRequest;
use App\Http\Requests\CompleteAdminRequest;
use App\User;
use App\Student;
use App\EmailModels;
use JWTFactory;
use JWTAuth;
use Validator;
use Response;
use Mail;

class AuthController extends Controller
{
    
    public function authenticate(AuthRequest $request){
        $user = User::where('email', $request->email)
            ->where('password', $request->password)
            ->first();
        if(!$user){
            return response()->json(['message' => 'Usuário inválido'], 400);
        }
        $token = JWTAuth::fromUser($user);
        return response()->json(['_token' => 'Bearer '.$token, 'user' => $user], 200);
    }

    public function info(){
        $user = JWTAuth::parseToken()->authenticate();
        if($user->user_type == 2){
            $user->student = Student::where('user_id', $user->id)->first();
        }
        return response()->json(['user' => $user], 200);
    }

    public function google(Request $request){
        $checkEmail = false;

        $users = User::where('google_admin', '1')->get();
        foreach ($users as $key => $user) {
            if($user->email == $request->email){

                $user = User::where('email', $request->email)
                    ->where('google_admin', '1')->first();
                if($user){
                    $user->name = $request->name;
                    $user->google_id = $request->google_id;
                    $user->password = $request->password;
                    $user->save();
                    $token = JWTAuth::fromUser($user);
                    return response()->json(['_token' => 'Bearer '.$token, 'user' => $user], 200);        
                }
            }
        }

        $emails = EmailModels::get();
        foreach ($emails as $key => $email) {
            $domain = explode('@', $email->email);
            $domain_mail = explode('@', $request->email);

            if($domain[1] === $domain_mail[0] || $domain[1] === $domain_mail[1]){
                $checkEmail = true;
            }
        }

        if(!$checkEmail){
            return response()->json(['message' => 'E-mail inválido'], 400);
        }

        $user = User::where('email', $request->email)
            ->where('google_id', $request->google_id)
            ->first();

        if(!$user){
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'google_id' => $request->google_id,
                'password' => $request->token,
                'user_type' => 2
            ]);
            if($user->user_type == 2){
                Student::create([
                    'user_id' => $user->id
                ]);
            }

            $token = JWTAuth::fromUser($user);
            return response()->json(['_token' => 'Bearer '.$token, 'user' => $user], 200);
        }
        $token = JWTAuth::fromUser($user);
        return response()->json(['_token' => 'Bearer '.$token, 'user' => $user], 200);
    }

    public function createAdmin(CreateAdminRequest $request){
        $clientUrl = 'http://localhost:4200/completar/admin/';
        $user = User::where('email', $request->email)->first();
        if($request->google == '1'){
            if($user){
                $user->google_admin = 1;
                $user->user_type = 1;
                $user->save();
            }else{
                User::create([
                    'email' => $request->email,
                    'google_admin' => 1,
                    'user_type' => 1
                ]);
            }

            return response()->json(['message'=> 'Usuário liberado para acesso com E-mail Google'], 200);
        }
        
        if(!empty($user->name) || !empty($user->password)){
            return response()->json(['message'=> 'Usuário ja cadastrado'], 400);
        }

        if($user){
            $token = JWTAuth::fromUser($user);
            $data = array('token'=> $clientUrl.'Bearer '.$token);

            Mail::send('emails.admin', $data, function($message) use ($request) {
                    $message->to($request->email, '')
                    ->subject('Seja um administrador em horas complementares STADS');
            });
             return response()->json(['message'=> 'E-mail enviado novamente'], 200);
        }else{
            $user = User::create([
                'email' => $request->email,
                'google_admin' => 0,
                'user_type' => 1
            ]);
            $token = JWTAuth::fromUser($user);
            $data = array('token'=> $clientUrl.'Bearer '.$token);

            Mail::send('emails.admin', $data, function($message) use ($request) {
                    $message->to($request->email, '')
                    ->subject('Seja um administrador em horas complementares STADS');
            });
            return response()->json(['message'=> 'E-mail enviado'], 200);
        }
    }

    public function completeCreateAdmin(CompleteAdminRequest $request){
        $user = JWTAuth::parseToken()->authenticate();
        if(!$user){
            return response()->json(['message' => 'Usuário não encontrado'], 400);
        }

        $admin = User::where('id', $user->id)->first();

        $admin->password = $request->password;
        $admin->name = $request->name;
        $admin->save();

        return response()->json(['message' => 'Administrador cadastrado'], 200);
    }

}

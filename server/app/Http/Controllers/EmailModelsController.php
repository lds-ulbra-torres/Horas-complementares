<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\EmailModels;
use App\User;
use Response;

class EmailModelsController extends Controller
{
    public function getAll(){
        $emails = EmailModels::orderByDesc('id')->get();

        return response()->json(['emails' => $emails], 200);
    }

    public function create(Request $request){
        if($request->email){
            $mail = EmailModels::create([
                'email' => $request->email
            ]);
            return response()->json([$mail], 200);
        }else{
            return response()->json(['message' => 'Modelo de e-mail não encontrado'], 400);
        }
    }

    public function delete($id){
        $email = EmailModels::where('id', $id)->first();
        if(!$email){
            return response()->json(['message' => 'Modelo de e-mail não encontrado'], 404);
        }

        $users = User::get();

        foreach ($users as $key => $user) {
            $domain = explode('@', $user->email);
            $domain_mail = explode('@', $email->email);

            if($domain[1] === $domain_mail[0] || $domain[1] === $domain_mail[1]){
                return response()->json(['message' => 'Modelo de e-mail em uso'], 400);
            }
        }

        $email->delete();
        return response()->json(['message' => 'Modelo de e-mail deletado'], 200);
    }
}

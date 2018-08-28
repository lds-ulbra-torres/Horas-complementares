<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Response;

class AuthRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'email' => 'required|email',
            'password' => 'required'
        ];
    }

    public function messages(){
        return[
            'email.required' => 'E-mail não encontrado',
            'email.email' => 'E-mail inválido',
            'password.required' => 'Senha não encontrada'
        ];
    }

    public function response(array $errors){
        return Response::json($errors, 400);
    }
}

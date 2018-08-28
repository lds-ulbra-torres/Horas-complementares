<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CompleteAdminRequest extends FormRequest
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
            'name' => 'required',
            'password' => 'required'
        ];
    }
    public function messages(){
        return[
            'name.required' => 'Nome não encontrado',
            'password.required' => 'Senha não encontrada',
        ];
    }

    public function response(array $errors){
        return Response::json($errors, 400);
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CompleteRegisterRequest extends FormRequest
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
            'cgu' => 'required|numeric',
            'matricula' => 'required'
        ];
    }
    public function messages(){
        return[
            'cgu.required' => 'CGU não encontrado',
            'cgu.numeric' => 'CGU deve conter apenas números',
            'matricula.required' => 'Matricula não encontrada',
        ];
    }

    public function response(array $errors){
        return Response::json($errors, 400);
    }
}

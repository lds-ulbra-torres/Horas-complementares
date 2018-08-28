<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GroupRuleRequest extends FormRequest
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
            'max_hours' => 'required|numeric'
        ];
    }
    public function messages(){
        return[
            'name.required' => 'Nome não encontrada',
            'max_hours.required' => 'Máximo de horas não encontado',
            'max_hours.numeric' => 'Máximo de horas deve ser um número'
        ];
    }

    public function response(array $errors){
        return Response::json($errors, 400);
    }
}

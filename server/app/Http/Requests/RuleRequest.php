<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RuleRequest extends FormRequest
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
            'group' => 'required|exists:group_rule,id',
            'classification' => 'required|unique:rules,classification,'.$this->id,
            'activity' => 'required',
            'percentage' => 'required|numeric',
            //'max_hours' => 'required|numeric'
        ];
    }
    public function messages(){
        return[
            'classification.required' => 'Classificação não encontrada',
            'classification.unique' => 'Classificação já existe',
            'activity.required' => 'Atividade não encontrada',
            'percentage.required' => 'Porcentagem de horas não encontrada',
            'percentage.numeric' => 'Porcentagem de horas deve ser um número',
            'max_hours.required' => 'Máximo de horas não encontado',
            'max_hours.numeric' => 'Máximo de horas deve ser um número',
            'group.required' => 'Grupo de atividade não encontrado',
            'group.exists' => 'Grupo de atividade não encontrado'
        ];
    }

    public function response(array $errors){
        return Response::json($errors, 400);
    }
}

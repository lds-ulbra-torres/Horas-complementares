<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Response;

class AtaRequest extends FormRequest
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
            'year' => 'required|numeric',
            'semester' => 'required|numeric'
        ];
    }

    public function messages(){
        return[
            'year.required' => 'Ano da ATA não encontrado',
            'year.numeric' => 'Ano invalido',
            'semester.required' => 'Semestre da ATA não encontrado',
            'semester.numeric' => 'Semestre invalido'
        ];
    }

    public function response(array $errors){
        return Response::json($errors, 400);
    }
}

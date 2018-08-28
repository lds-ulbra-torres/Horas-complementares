<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CertificateRequest extends FormRequest
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
            //'student_id' => 'required|exists:students',
            /*'rule_id' => 'required|exists:rules',*/
            'event' => 'required',
            'date_event' => 'date',
            'certificate_file' => 'required|file|mimes:jpeg,png,jpg,gif,pdf|max:5048',
            //'institution' => 'required',
            'ch' => 'numeric'
        ];
    }

    public function messages(){
        return[
            'student_id.required' => 'Aluno não encontrado',
            'student_id.exists' => 'Aluno não encontrado',
            'rule_id.required' => 'Código de classificação não encontrado',
            'rule_id.exists' => 'Código de classificação não encontrado',
            'event.required' => 'O nome do evento é obrigatório',
            'date_event.required' => 'A data do evento é obrigatório',
            'date_event.date' => 'Data inválida',
            'institution.required' => 'A instituição é obrigatório',
            'ch.numeric' => 'Carga horaria inválida',
            'certificate_file.required' => 'Imagem não encontrada',
            'certificate_file.image' => 'Arquivo inválido',
            'certificate_file.mimes' => 'Arquivo inválido',
            'certificate_file.max' => 'Tamanho máximo excedido'
        ];
    }

    public function response(array $errors){
        return Response::json($errors, 400);
    }
}

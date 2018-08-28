<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CertificateAvaliationRequest extends FormRequest
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
            //'rule' => 'required|exists:rules,id',
            'event' => 'required',
            'date_event' => 'date',
            'ch' => 'required',
            'status' => 'required|between:1,2'
        ];
    }

    public function messages(){
        return[
            'student_id.required' => 'Aluno não encontrado',
            'student_id.exists' => 'Aluno não encontrado',
            'rule.required' => 'Código de classificação não encontrado',
            'rule.exists' => 'Código de classificação não encontrado',
            'event.required' => 'O nome do evento é obrigatório',
            'date_event.required' => 'A data do evento é obrigatório',
            'date_event.date' => 'Data inválida',
            'institution.required' => 'A instituição é obrigatório',
            'ch.required' => 'o CH deve ser em horas(apenas números)',
            'file_url.required' => 'Imagem não encontrada',
            'file_url.image' => 'Arquivo inválido',
            'file_url.max' => 'Tamanho máximo excedido',
            'status.required' => 'Status não encontrado',
            'status.between' => 'Status inválido',
        ];
    }

    public function response(array $errors){
        return Response::json($errors, 400);
    }
}

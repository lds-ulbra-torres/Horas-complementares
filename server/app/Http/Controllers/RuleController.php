<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Rule;
USE App\GroupRule;
use App\Certificate;
use App\Http\Requests\RuleRequest;
use App\Http\Requests\GroupRuleRequest;

class RuleController extends Controller
{
    public function getAll(){
        $rules = Rule::join('group_rule', 'group_rule.id', '=', 'rules.group_id')
        ->orderByDesc('rules.id')
        ->select('rules.*', 'group_rule.name')->get();

        return response()->json(['rules' => $rules], 200);
    }

    public function get($id){
        $rule = Rule::where('id', $id)->first();
        if(!$rule){
            return response()->json(['message' => 'Regra não encontrada'], 404);        
        }
        return response()->json(['message' => 'Regra não encontrada'], 404); 
    }

    public function create(RuleRequest $request){
        $rule = Rule::create([
            'classification' => $request->classification,
            'activity' => $request->activity,
            'percentage' => $request->percentage,
            'group_id' => $request->group
        ]);
        
        return response()->json([$rule], 200);
    }

    public function update(RuleRequest $request, $id){
        $rule = Rule::find($id);
        if(!$rule){
            return response()->json(['message' => 'Regra não encontrada'], 404);        
        }

        $rule->classification = $request->classification;
        $rule->activity = $request->activity;
        $rule->percentage = $request->percentage;
        $rule->group = $request->group;
        $rule->save();

        return response()->json(['message' => 'Regra alterada com sucesso'], 200);
    }

    public function delete($id){
        $rule = Rule::where('id', $id)->first();
        if(!$rule){
            return response()->json(['message' => 'Regra não encontrada'], 404); 
        }
        $certificate = Certificate::where('rule_id', $id)->first();
        if($certificate){
            return response()->json(['message' => 'Não é possível exlcuir esta regra. Ela esta em uso.'], 400); 
        }
        $rule->delete();
        return response()->json(['message' => 'Regra deletada com sucesso'], 200); 
    }

    /** GROUPS **/
    public function getAllGroups(){
        $groups = GroupRule::orderByDesc('id')->get();

        return response()->json(['groups' => $groups], 200);
    }

    public function createGroup(GroupRuleRequest $request){
        $group = GroupRule::create([
            'name' => $request->name,
            'max_hours' => $request->max_hours
        ]);
        
        return response()->json([$group], 200);
    }

    public function deleteGroup($id){
        $group = GroupRule::where('id', $id)->first();
        if(!$group){
            return response()->json(['message' => 'Grupo não encontrada'], 404); 
        }
        $rule = Rule::where('group_id', $id)->first();
        if($rule){
            return response()->json(['message' => 'Não é possível exlcuir este grupo. Ele esta em uso.'], 400); 
        }
        $group->delete();
        return response()->json(['message' => 'Grupo deletado com sucesso'], 200); 
    }
}

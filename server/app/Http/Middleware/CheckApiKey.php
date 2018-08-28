<?php

namespace App\Http\Middleware;

use Closure;

class CheckApiKey
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        
        $APP_KEY = 'base64:7e5rV9ZfeAz55LKbaVKyq5ljsiK7qBqh/6lgu1Rs+Gk=';
        $key = $request->header('app-key');

        if(isset($key)){
            if($key === $APP_KEY){
                return $next($request);
                
            }else{
                return response()->json([
                    'messages' => [
                        'error' => 'A chave de api informada incorreta'
                    ]
                ]);
            }
        }else{
            return response()->json([
                'messages' => [
                    'error' => 'Chave de api não encontrada'
                ]
            ]);
        }

        
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Facades\JWTAuth;
use Response;

class CheckAdmin
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

        $user = JWTAuth::parseToken()->toUser();
        if($user->user_type != 1){
            return response()->json([
                'messages' => [
                    'error' => 'Seu usuário não tem permissão para essa ação'
                ]
            ], 403);
        }
        
        return $next($request);
    }
}
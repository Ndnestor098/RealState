<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class Users
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verifica si hay un usuario autenticado
        if (!Auth::check()) {
            return redirect(route('login'))->with('error', 'You must be logged in.');
        }

        $user = Auth::user();

        // Carga relaciones de roles y permisos
        $user->load('roles.permissions');

        // Obtiene los nombres de todos los permisos del usuario
        $permissions = $user->roles
            ->flatMap(function ($role) {
                return $role->permissions->pluck('name');
            })
            ->unique()
            ->values();

        // Verifica si tiene el permiso 'users'
        if ($permissions->contains('users')) {
            return $next($request);
        }

        return redirect(route("dashboard"))->with('error', 'You do not have permission to access this section.');
    }
}

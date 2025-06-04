<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Visualiza la informacion de la base de datos de usuarios.
     *
     * @param  \Illuminate\Http\Request  $request Contiene los datos de la solicitud.
     * 
     * @return \Inertia\Inertia renderiza la visita Auth/Users
     */
    public function index(Request $request)
    {
        $Cache_Name = "users_" . $request->page;
        
        if(Cache::has($Cache_Name)){
            $users = Cache::get($Cache_Name);
        } else {
            $users = User::with('roles')->orderBy('active', 'DESC')->paginate(11);

            Cache::put($Cache_Name, $users, now()->addMinutes(60));
        }

        return Inertia::render('Auth/Users', [
            'auth' => Auth::user()->load('roles.permissions'),
            'users' => $users,
        ]);
    }

    /**
     * Visualiza la tabla para crear un usuario.
     *
     * @return \Inertia\Inertia renderiza la visita Auth/CreateUsers
     */
    public function create()
    {
        return Inertia::render('Auth/CreateUser',[
            'auth' => Auth::user()->load('roles.permissions'),
            'roles' => Role::all(),
        ]);
    }

    /**
     * Crea un usuario nuevo.
     *
     * @param  \Illuminate\Http\Request  $request Contiene los datos de la solicitud.
     * 
     * @return \Inertia\Inertia renderiza la visita Auth/CreateUsers
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|string|unique:users,email',
            'password' => 'required|string',
            'role' => 'required|array'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->input('password')),
        ]);

        $user->roles()->sync(array_unique($request->role ?? []));

        $user->save();

        Cache::flush();

        return redirect(route("users"));
    }

    /**
     * Visualiza la informacion para editar el usuario pasado por el ID.
     * 
     * @param  int $id Recibe una instancia del modelo User.
     * 
     * @return \Inertia\Inertia renderiza el area para crear visita Visit
     */
    public function edit(string $id)
    {
        $user = User::with('roles')->findOrFail($id);
        $permissions = Auth::user()
            ->load('roles.permissions')
            ->roles
            ->flatMap(function ($role) {
                return $role->permissions->pluck('name');
            })
            ->unique()
            ->values();

        if(!$permissions->contains('users')){
            return Inertia::render('Auth/UpdateUser', [
                'auth' => Auth::user()->load('roles.permissions'),
                'user' => $user,
            ]);
        }

        if(!$permissions->contains('users') && $user->id != Auth::id()){
            return redirect(route('dashboard'))->with('error', 'You do not have permission to access this section.');
        }

        $roles_id = $user->roles->pluck('id');

        
        
        $user = User::findOrFail($id);
        
        return Inertia::render('Auth/UpdateUser', [
            'auth' => Auth::user()->load('roles.permissions'),
            'user' => $user,
            'roles' => Role::all(),
            'roles_id' => $roles_id,
        ]);
    }

    /**
     * Actualiza un usuario pasado por el ID.
     * 
     * @param  \Illuminate\Http\Request  $request Contiene los datos de la solicitud.
     * @param  int $id Recibe una instancia del modelo User.
     * 
     * @return \Inertia\Inertia renderiza el area para crear visita Visit
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => [
                'required',
                'email',
                'string',
                Rule::unique('users', 'email')->ignore($id),
                
            ],
            'password' => 'required|string',
            'role' => 'array'
        ]);
        
        $user = User::findOrFail($id);
        
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password ? Hash::make($request->password) : $user->password, // Solo actualiza si hay password
        ]);

        if ($request->has('role')) {
            $user->roles()->sync(array_unique($request->role));
        }        

        Cache::flush();

        return redirect(route("users"));
    }

    /**
     * Elimina un usuario pasado por el ID.
     * 
     * @param  int $id Recibe una instancia del modelo User.
     * 
     * @return \Inertia\Inertia renderiza el area para crear visita Visit
     */
    public function destroy($id)
    {
        User::findOrFail($id)->delete();

        Cache::flush();

        return redirect(route('users'));
    }
}

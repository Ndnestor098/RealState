<?php

namespace App\Http\Controllers;

use App\Models\Feature;
use App\Models\House;
use App\Models\TypeHouse;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class HouseController extends Controller
{
    /**
     * Muestra una lista de casas basadas en los filtros proporcionados.
     *
     * @param  \Illuminate\Http\Request  $request  Contiene los datos de la solicitud.
     * 
     * @return Inertia\Inertia  Retorna un renderizado con Inertia.
     */
    public function index(Request $request)
    {
        // Construye la consulta para obtener las casas basadas en los filtros proporcionados.
        $query = House::with(['features', 'typeHouse']) // Carga las relaciones de características y tipo de casa.
            ->whereHas('features', function($query) use ($request){
                // Verifica si se han proporcionado características en la solicitud.
                if($request->has('features')) {
                    $arrayFeatures = explode(",", $request->features); // Convierte la cadena de características en un array.
                    $query->whereIn('name', $arrayFeatures); // Filtra las casas que tienen las características especificadas.
                }
            })
            ->whereHas('features', function ($query) use ($request) {
                // Filtra las casas que tienen todas las características solicitadas.
                if ($request->has('features')) {
                    $arrayFeatures = explode(",", $request->features);
                    $query->whereIn('name', $arrayFeatures)
                        ->groupBy('house_id')
                        ->havingRaw('COUNT(DISTINCT name) = ?', [count($arrayFeatures)]); // Asegura que se cumplan todas las características.
                }
            })
            ->MaxPrice($request->maxPrice) // Aplica el filtro de precio máximo.
            ->MinPrice($request->minPrice) // Aplica el filtro de precio mínimo.
            ->MinSize($request->minSize) // Aplica el filtro de tamaño mínimo.
            ->MaxSize($request->maxSize) // Aplica el filtro de tamaño máximo.
            ->Quarter($request->quarter) // Aplica el filtro de cuartos.
            ->Bath($request->bathroom) // Aplica el filtro de baños.
            ->Search($request->search) // Aplica el filtro de búsqueda.
            ->TypeHouse($request->type_house) // Aplica el filtro de tipo de casa.
            ->published($request->published) // Si se solicita, filtra solo las casas publicadas.
            ->paginate(12); 

        // Modifica las URLs de las imágenes en cada casa.
        $query->transform(function ($house) {
            // Asegúrate de que $house->images es un array.
            if (is_string($house->images)) {
                // Convierte la cadena de imágenes en un array.
                $house->images = json_decode($house->images, true);
            }

            // Verifica si $house->images es un array antes de usar array_map.
            if (is_array($house->images)) {
                $house->images = array_map(function ($image) {
                    return url('storage/' . $image); // Modifica la URL de cada imagen.
                }, $house->images);
            }

            return $house; // Retorna el objeto de casa modificado.
        });

        $query->withQueryString();
        
        $type_house = TypeHouse::all();
        $features = Feature::all();

        // Retorna una respuesta JSON con los datos de las casas y un mensaje de éxito.
        return Inertia::render('PropertiesCatalog',[
            'data' => $query,
            'typeHouse' => $type_house, 
            'features' => $features
        ]);
    }

    /**
     * Muestra una casa basada en el ID.
     *
     * @param  \Illuminate\Http\Request  $request  Contiene los datos de la solicitud.
     * 
     * @return Inertia\Inertia  Retorna un renderizado con Inertia.
     */
    public function show($id, Request $request)
    {
        $Cache_Name = 'propertie_' . $id;

        if(Cache::has($Cache_Name)){
            $query = Cache::get($Cache_Name);
        } else {
            // Carga la casa con sus características y tipo, y filtra por el estado de publicación.
            $query = House::with(['features', 'typeHouse'])
                ->published($request->published) // Aplica el filtro de publicación.
                ->find($id); // Busca la casa por su ID.

            // Verifica si se encontró la casa.
            if (!$query) {
                return redirect(route("home"));
            }

            // Incrementa el contador de vistas de la casa.
            $query->viewed = $query->viewed + 1;

            $query->save(); // Guarda los cambios en la base de datos.

            // Asegúrate de que $query->images es un array.
            if (is_string($query->images)) {
                // Convierte la cadena de imágenes en un array.
                $query->images = json_decode($query->images, true);
            }

            // Verifica si $query->images es un array antes de usar array_map.
            if (is_array($query->images)) {
                // Modifica la URL de cada imagen y almacena el resultado en $query->images.
                $query->images = array_map(function ($image) {
                    return url('storage/' . $image); // Modifica la URL de cada imagen.
                }, $query->images);
            }

            Cache::put($Cache_Name, $query, now()->addHours(2));
        }
    
        // Retorna la respuesta JSON con los datos de la casa.
        return Inertia::render('Propertie', [
            'data' => $query, // Datos de la casa.
        ]);
        
    }


    /**
     * Muestra una lista de casas para el administrador.
     *
     * @param  \Illuminate\Http\Request  $request  Contiene los datos enviados en la solicitud.
     * 
     * @return Inertia\Inertia  Retorna un renderizado con Inertia.
     */
    public function index_administer(Request $request)
    {
        $Cache_Name = 'properties_' . $request->page;
        
        if(Cache::has($Cache_Name) && !$request->has('address')){
            $query = Cache::get($Cache_Name);
        } else {
            // Carga la casa con sus características y tipo, y filtra por el estado de publicación.
            $query = House::search($request->address)->paginate(9); // Busca la casa por su ID.

            // Modifica las URLs de las imágenes en cada casa.
            $query->transform(function ($house) {
                // Asegúrate de que $house->images es un array.
                if (is_string($house->images)) {
                    // Convierte la cadena de imágenes en un array.
                    $house->images = json_decode($house->images, true);
                }

                // Verifica si $house->images es un array antes de usar array_map.
                if (is_array($house->images)) {
                    $house->images = array_map(function ($image) {
                        return url('storage/' . $image); // Modifica la URL de cada imagen.
                    }, $house->images);
                }

                return $house; // Retorna el objeto de casa modificado.
            });

            if(!$request->has('address')){
                Cache::put($Cache_Name, $query, now()->addHours(2));
            }
        }
    
        // Retorna la respuesta JSON con los datos de la casa.
        return Inertia::render('Auth/Properties', [
            'auth' => Auth::user()->load('roles.permissions'),
            'house' => $query, // Datos de la casa.
        ]);
        
    }

    /**
     * Muestra el area de creacion de casas para el administrador.
     * 
     * @return Inertia\Inertia  Retorna un renderizado con Inertia. 
     */
    public function create()
    {
        $typeHouse = TypeHouse::all();
        $feature = Feature::all();

        // Retorna una respuesta JSON indicando que la operación fue exitosa junto con los datos de la casa.
        return Inertia::render('Auth/CreateProperty',[
            'auth' => Auth::user()->load('roles.permissions'),
            'typeHouse' => $typeHouse,
            'feature' => $feature,
        ]);
    }

    /**
     * Crea una nueva casa basada en la información proporcionada por el administrador.
     *
     * @param  \Illuminate\Http\Request  $request  Contiene los datos enviados en la solicitud.
     * @param  App\Services\ImageService  $methodImage  Servicio para el control de imágenes, 
     * 
     * @return Redirect  Retorna una redirect hacia la vista index_Administer.
     */
    public function store(Request $request, ImageService $methodImage)
    {
        // Valida la información recibida en la solicitud.
        $request->validate([
            'address' => 'required|string|max:255',              // Dirección es requerida, debe ser una cadena y no exceder 255 caracteres.
            'description' => 'required|string|max:100000',       // Descripción es requerida, debe ser una cadena y no exceder 100000 caracteres.
            'bathroom' => 'required|integer|min:1',              // El número de baños es requerido, debe ser un entero y al menos 1.
            'date_construction' => 'required|date|before:today', // La fecha de construcción es requerida, debe ser una fecha y antes de hoy.
            'feature' => 'required|array|min:1',                  // Las características son requeridas, deben ser un array y al menos 1 elemento.
            'floor' => 'integer|min:0',                           // El número de pisos debe ser un entero y puede ser 0.
            'images.*' => 'required|image|max:2048',             // Cada imagen es requerida, debe ser un archivo de imagen y no exceder 2048 KB.
            'price' => 'required|numeric|min:0',                  // El precio es requerido, debe ser numérico y no menor que 0.
            'quarters' => 'required|integer|min:1',               // El número de habitaciones es requerido, debe ser un entero y al menos 1.
            'type_house' => 'required|string'                      // El tipo de casa es requerido, debe ser una cadena.
        ]);

        // Guarda las imágenes utilizando el servicio de imágenes y obtiene sus rutas.
        $imagePaths = $methodImage->SaveImage($request->file('images'));

        // Crea una nueva instancia de House con la información proporcionada.
        $house = House::create([
            'address' => $request->input('address'),               // Dirección de la casa.
            'description' => $request->input('description'),       // Descripción de la casa.
            'bathroom' => $request->input('bathroom'),             // Número de baños.
            'date_construction' => $request->input('date_construction'), // Fecha de construcción.
            'floor' => $request->input('floor'),                   // Número de pisos.
            'images' => json_encode($imagePaths, true),            // Rutas de las imágenes en formato JSON.
            'price' => $request->input('price'),                   // Precio de la casa.
            'quarters' => $request->input('quarters'),             // Número de habitaciones.
            'size' => $request->input('size'),                     // Temaño de la casa.
            'type_house_id' => $request->input('type_house'),       // id del tipo de casa.
            'published' => $request->input('published') ? '1' : '0' // Publicar casa.
        ]);

        // Sincroniza las características con la casa creada.
        $house->features()->sync($request->input('feature'));

        Cache::flush();
        
        // Retorna una respuesta JSON indicando que la operación fue exitosa junto con los datos de la casa.
        return redirect(route("properties"));
    }

    /**
     * Muestra el area de creacion de casas para el administrador.
     *
     * @param  int $id Se necesita el ID para la búsqueda en la tabla houses.
     *
     * @return Inertia\Inertia  Retorna un renderizado con Inertia.
     */
    public function edit($id)
    {
        $query = House::with(["features", "typeHouse"])->find($id);

        if (!$query) {
            return redirect(route("properties"));
        }

        $query->features->transform(function ($item) {
            return $item->id;
        });

        $query->images = array_map(function ($item) {
            return $item;
        }, json_decode($query->images));

        $query->typeHouse = $query->typeHouse->id;
        $typeHouse = TypeHouse::all();
        $feature = Feature::all();

        // Retorna una respuesta JSON indicando que la operación fue exitosa junto con los datos de la casa.
        return Inertia::render('Auth/UpdateProperty',[
            'auth' => Auth::user()->load('roles.permissions'),
            'house' => $query,
            'typeHouse' => $typeHouse,
            'feature' => $feature,
        ]);
    }

    /**
     * Crea una nueva casa basada en la información proporcionada.
     *
     * @param  int  $id Se necesita el ID para la búsqueda en la tabla houses.
     * @param  \Illuminate\Http\Request  $request  Contiene los datos enviados en la solicitud.
     * @param  App\Services\ImageService  $methodImage  Servicio para el control de imágenes, 
     *                                                    guardar, dar nombres y chequear existencias de imágenes antiguas.
     * @return Inertia\Inertia  Retorna un renderizado con Inertia.
     */
    public function update($id, Request $request, ImageService $methodImage)
    {
        // Valida la información recibida en la solicitud.
        $request->validate([
            'address' => 'required|string|max:255',              // Dirección es requerida, debe ser una cadena y no exceder 255 caracteres.
            'description' => 'required|string|max:100000',       // Descripción es requerida, debe ser una cadena y no exceder 100000 caracteres.
            'bathroom' => 'required|integer|min:1',              // El número de baños es requerido, debe ser un entero y al menos 1.
            'date_construction' => 'required|date|before:today', // La fecha de construcción es requerida, debe ser una fecha y antes de hoy.
            'features' => 'required|array|min:1',                  // Las características son requeridas, deben ser un array y al menos 1 elemento.
            'floor' => 'integer|min:0',                           // El número de pisos debe ser un entero y puede ser 0.
            'images_old' => 'array|min:1',                        // Las imágenes antiguas deben ser un array y al menos 1 elemento.
            'images.*' => 'image|max:2048',                       // Cada nueva imagen es opcional, debe ser un archivo de imagen y no exceder 2048 KB.
            'price' => 'required|numeric|min:0',                  // El precio es requerido, debe ser numérico y no menor que 0.
            'quarters' => 'required|integer|min:1',               // El número de habitaciones es requerido, debe ser un entero y al menos 1.
            'type_house' => 'required|integer|exists:type_houses,id'                      // El tipo de casa es requerido, debe ser una cadena.
        ]);

        $house = House::find($id);

        if(!$house){
            return redirect(route("properties"));
        }

        // Actualiza los atributos de la casa con los valores del request.
        $house->address = $request->input('address');                     // Actualiza la dirección.
        $house->description = $request->input('description');             // Actualiza la descripción.
        $house->bathroom = $request->input('bathroom');                   // Actualiza el número de baños.
        $house->quarters = $request->input('quarters');                   // Actualiza el número de habitaciones.
        $house->date_construction = $request->input('date_construction'); // Actualiza la fecha de construcción.
        $house->price = $request->input('price');                         // Actualiza el precio.
        $house->size = $request->input('size');                           // Actualiza el tamaño (asumiendo que este campo existe).
        $house->published = $request->input('published') ? "1" : "0";    // Actualiza el estado de publicación (booleano a entero).
        $house->features()->sync($request->input('features'));             // Sincroniza las características con la casa.
        $house->type_house_id = $request->input('type_house');    // Asocia el tipo de casa con la instancia actual.
        $house->floor = $request->input('floor');                         // Actualiza el número de pisos.

        // Decodifica las imágenes actuales del modelo.
        $image_model = json_decode($house->images, true);
        // Verifica si hay cambios en las imágenes antiguas.
        $control_image_old = $methodImage->checkChangeImages($image_model, $request->input('images_old'));
        
        // Si se han proporcionado nuevas imágenes, las guarda y las agrega a la lista de imágenes de la casa.
        if ($request->images && $request->has('images')) {
            $imagePaths = $methodImage->SaveImage($request->file('images')); // Guarda las nuevas imágenes.

            // Combina las imágenes antiguas y las nuevas en un solo array.
            $oldImages = $request->input('images_old');
            if (!is_array($oldImages)) {
                $oldImages = [];
            }

            $house->images = json_encode(array_merge($oldImages, $imagePaths));

        // Si no hay nuevas imágenes pero hay cambios en las imágenes antiguas, las actualiza.
        } else if($control_image_old) {
            $house->images = json_encode($request->input('images_old'));
        }

        // Guarda los cambios en el modelo de casa.
        $house->save();

        Cache::flush();

        // Retorna una respuesta JSON indicando que la operación fue exitosa junto con los datos de la casa.
        return redirect(route("properties"));
    }

    /**
     * Crea una nueva casa basada en la información proporcionada.
     *
     * @param  int  $id Se necesita el ID para la búsqueda en la tabla houses.
     * @param  App\Services\ImageService  $methodImage  Servicio para el control de imágenes, 
     *                                                    guardar, dar nombres y chequear existencias de imágenes antiguas.
     * @return Redirect  Retorna una redirect hacia la vista index_Administer.
     */
    public function destroy($id, ImageService $methodImage)
    {   
        try {
            Cache::flush();

            // Busca la casa por su ID o lanza una excepción 404 si no la encuentra.
            $house = House::findOrFail($id);

            // Decodifica las imágenes guardadas en el campo 'images'.
            $images = json_decode($house->images, true);

            // Elimina las imágenes del almacenamiento.
            $methodImage->deleteImages($images);

            // Elimina la casa de la base de datos.
            $house->delete();

            // Retorna una respuesta JSON indicando que la operación fue exitosa.
            return redirect(route("properties"));
            
        } catch (\Throwable $e) {
            return redirect(route("properties"));
        }
        
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

use function PHPUnit\Framework\isNull;

class House extends Model
{
    use HasFactory;
    use Notifiable;

    // Define la propiedad $guarded para la clase, especificando que no se aplican restricciones a la asignación masiva
    protected $guarded = [];


    // Desactiva el manejo automático de timestamps para esta clase
    public $timestamps = false;

    //================================== Relaciones de Tablas ==================================

    // Define la relación con TypeHouse
    public function typeHouse()
    {
        // Establece una relación de "pertenece a" (belongsTo) con el modelo TypeHouse
        // 'type_house_id' es la clave foránea en la tabla correspondiente.
        return $this->belongsTo(TypeHouse::class, 'type_house_id');
    }

    // Define la relación con Feature
    public function features()
    {
        // Establece una relación de "pertenece a muchos" (belongsToMany) con el modelo Feature
        // Utiliza la tabla intermedia 'feature_house' para gestionar la relación.
        return $this->belongsToMany(Feature::class, 'feature_house');
    }

    // Define la relación con Visit
    public function visits()
    {
        // Establece una relación de "tiene muchos" (hasMany) con el modelo Visit
        // Esto indica que una casa puede tener múltiples visitas asociadas.
        return $this->hasMany(Visit::class);
    }

    //================================== Filtros de busquedas ==================================
    // Definición de un alcance (scope) para filtrar propiedades por precio máximo.
    public function scopeMaxPrice($query, $price)
    {
        // Verifica si el precio no es nulo.
        if(!is_null($price))
            // Agrega una condición al query para filtrar propiedades cuyo precio sea menor o igual al precio proporcionado.
            return $query->where('price', '<=', intval($price));

        return $query; // Si el precio es nulo, retorna el query sin modificaciones.
    }

    // Definición de un alcance (scope) para filtrar propiedades por precio mínimo.
    public function scopeMinPrice($query, $price)
    {
        // Verifica si el precio no es nulo.
        if(!is_null($price))
            // Agrega una condición al query para filtrar propiedades cuyo precio sea mayor o igual al precio proporcionado.
            return $query->where('price', '>=', intval($price));

        return $query; // Si el precio es nulo, retorna el query sin modificaciones.
    }

    // Definición de un alcance (scope) para filtrar propiedades por tamaño máximo.
    public function scopeMaxSize($query, $size)
    {
        // Verifica si el tamaño no es nulo.
        if(!is_null($size))
            // Agrega una condición al query para filtrar propiedades cuyo tamaño sea menor o igual al tamaño proporcionado.
            return $query->where('size', '<=', intval($size));

        return $query; // Si el tamaño es nulo, retorna el query sin modificaciones.
    }

    // Definición de un alcance (scope) para filtrar propiedades por tamaño mínimo.
    public function scopeMinSize($query, $size)
    {
        // Verifica si el tamaño no es nulo.
        if(!is_null($size))
            // Agrega una condición al query para filtrar propiedades cuyo tamaño sea mayor o igual al tamaño proporcionado.
            return $query->where('size', '>=', intval($size));

        return $query; // Si el tamaño es nulo, retorna el query sin modificaciones.
    }

    // Definición de un alcance (scope) para filtrar propiedades por número de cuartos.
    public function scopeQuarter($query, $quarter)
    {
        // Verifica si el número de cuartos no es nulo.
        if (!is_null($quarter)) {
            // Si el número de cuartos es mayor o igual a 4, filtra las propiedades con cuartos mayor o igual al número proporcionado.
            if ($quarter >= 4) {
                return $query->where('quarters', '>=', intval($quarter));
            } else {
                // Si el número de cuartos es menor a 4, filtra las propiedades que tengan exactamente el número de cuartos proporcionado.
                return $query->where('quarters', intval($quarter));
            }
        }

        return $query; // Si el número de cuartos es nulo, retorna el query sin modificaciones.
    }

    // Definición de un alcance (scope) para filtrar propiedades por número de baños.
    public function scopeBath($query, $bath)
    {
        // Verifica si el número de baños no es nulo.
        if (!is_null($bath)) {
            // Si el número de baños es mayor o igual a 3, filtra las propiedades con baños mayor o igual al número proporcionado.
            if ($bath >= 3) {
                return $query->where('bathroom', '>=', intval($bath));
            } else {
                // Si el número de baños es menor a 3, filtra las propiedades que tengan exactamente el número de baños proporcionado.
                return $query->where('bathroom', intval($bath));
            }
        }

        return $query; // Si el número de baños es nulo, retorna el query sin modificaciones.
    }

    // Definición de un alcance (scope) que no aplica ningún filtro.
    public function scopeFeatures($query)
    {
        return $query; // Retorna el query sin modificaciones.
    }

    // Definición de un alcance (scope) para filtrar propiedades por tipo de casa.
    public function scopeTypeHouse($query, $value)
    {
        // Verifica si el valor del tipo de casa no es nulo.
        if (!is_null($value)) {
            $query->whereHas('typeHouse', function ($query) use ($value) {
                $query->where('name', $value);
            });
        }

        return $query; // Si el valor es nulo, retorna el query sin modificaciones.
    }

    // Definición de un alcance (scope) para buscar propiedades por dirección.
    public function scopeSearch($query, $value)
    {
        // Verifica si el valor de búsqueda no es nulo.
        if(!is_null($value)){
            // Agrega una condición al query para filtrar propiedades cuya dirección contenga el valor buscado.
            return $query->where("address", "LIKE", "%".$value."%");
        }
    }

    // Definición de un alcance (scope) para filtrar propiedades de publised.
    public function scopePublished($query, $value)
    {
        // Verifica si el value no es nulo.
        if (!is_null($value)) {
            // Convierte el valor a booleano
            $isPublished = filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            
            // Agrega una condición al query para filtrar propiedades de published.
            return $query->where('published', $isPublished);
        }

        return $query->where('published', true); // Si el $value es nulo, retorna el query sin modificaciones.
    }

}

<p align="center"><a href="https://github.com/Ndnestor098/RealState" target="_blank"><img src="https://ndnestor098.github.io/WebCV/assets/img/Villa.png" width="100%" alt="Real State Logo"></a></p>

# Real State Villa

## Descripción

Real State Villa es una aplicación web desarrollada con Laravel y React, donde Laravel actúa como la API backend y React como el frontend. Esta aplicación está diseñada para gestionar bienes raíces, incluyendo funcionalidades como la visualización de casas, características de las propiedades, visitas, y notificaciones.

## Tecnologías

-   **Backend:** Laravel 11.9
-   **Frontend:** React 18.2
-   **Base de datos:** MySQL
-   **Autenticación:** Laravel Sanctum

## Requisitos

-   **PHP:** ^8.2
-   **Node.js y NPM:** Requeridos para la instalación de dependencias del frontend
-   **Composer:** Para manejar dependencias de PHP
-   **MySQL:** Para almacenar la base de datos

## Instalación

1. Clona el repositorio:

```bash
git https://github.com/Ndnestor098/RealState.git
cd RealState
```

2. Configura el entorno:

    Copia el archivo `.env.example` a `.env` y ajusta las configuraciones necesarias para la base de datos y otros servicios.

```bash
cp .env.example .env
```

3. Instala las dependencias de PHP y Node.js:

```bash
composer install
npm install
```

4. Genera la clave de la aplicación:

```bash
php artisan key:generate
```

5. Ejecuta las migraciones de la base de datos:

```bash
php artisan migrate
```

6. Inicia el servidor de desarrollo:

```bash
php artisan serve
npm run dev
```

## Dependencias principales

### Backend

```json
"require": {
    "php": "^8.2",
    "laravel/framework": "^11.9",
    "laravel/sanctum": "^4.0",
    "laravel/tinker": "^2.9",
    "laravel/ui": "^4.5"
}
```

### Frontend

```json
"dependencies": {
    "flatpickr": "^4.6.13",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-bootstrap": "^2.10.4",
    "react-flatpickr": "^3.10.13",
    "react-image-gallery": "^1.3.0",
    "react-paginate": "^8.2.0",
    "react-router-dom": "^6.26.1",
    "recharts": "^2.12.7",
    "suneditor": "^2.47.0",
    "swiper": "^11.1.14"
}
```

### Dev Dependencies

```json
"devDependencies": {
    "@babel/core": "^7.25.2",
    "@babel/plugin-transform-runtime": "^7.25.4",
    "@babel/preset-env": "^7.25.4",
    "@babel/preset-react": "^7.24.7",
    "@popperjs/core": "^2.11.6",
    "@testing-library/jest-dom": "^6.5.0",
    "@testing-library/react": "^16.0.1",
    "@vitejs/plugin-react": "^4.3.1",
    "axios": "^1.7.4",
    "bootstrap": "^5.3.3",
    "eslint": "^9.10.0",
    "eslint-plugin-react": "^7.35.2",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "laravel-vite-plugin": "^1.0",
    "sass": "^1.56.1",
    "vite": "^5.4.3"
}
```

## Vistas del Frontend

La aplicación tiene las siguientes rutas accesibles:

#### Rutas Públicas

-   **`/`**: Ruta principal (Componente: `Home`).
-   **`/properties`**: Lista de propiedades (Componente: `Properties`).
-   **`/contact`**: Página de contacto (Componente: `Contact`).
-   **`/property-details/:id`**: Detalles de una propiedad específica por su ID (Componente: `PropertiesDetails`).
-   **`/visit/:id`**: Página para agendar una visita con el ID de la propiedad (Componente: `MakeVisit`).

#### Rutas del Administrador

-   **`/admin-login`**: Ruta para el login del administrador (Componente: `LoginAdministrator`).
-   **`/dashboard`**: Panel principal del administrador protegido con `AuthProvider` (Componente: `Dashboard`).
-   **`/dashboard/users`**: Gestión de usuarios por parte del administrador (Componente: `UsersAdministrator`).
-   **`/dashboard/users/modify/:id`**: Modificar usuario por su ID (Componente: `ModifyUsers`).
-   **`/dashboard/users/create`**: Crear un nuevo usuario (Componente: `CreateUsers`).
-   **`/dashboard/properties`**: Gestión de propiedades por parte del administrador (Componente: `PropertiesAdministrator`).
-   **`/dashboard/properties/modify/:id`**: Modificar una propiedad por su ID (Componente: `ModifyProperties`).
-   **`/dashboard/properties/create`**: Crear una nueva propiedad (Componente: `CreateProperties`).
-   **`/dashboard/visit`**: Gestión de visitas por parte del administrador (Componente: `VisitAdministrator`).

## Rutas de la API

### Autenticación

-   `POST /login`: Iniciar sesión.
-   `POST /logout`: Cerrar sesión.

### Usuarios

-   `GET /users`: Obtener todos los usuarios.
-   `POST /users/create`: Crear un nuevo usuario.
-   `POST /users/update/{id}`: Actualizar un usuario existente.
-   `DELETE /users/delete/{id}`: Eliminar un usuario.

### Casas

-   `GET /houses`: Obtener todas las casas.
-   `POST /houses/create`: Crear una nueva casa.
-   `POST /houses/update/{house}`: Actualizar una casa.
-   `DELETE /houses/delete/{house_id}`: Eliminar una casa.

### Características

-   `GET /features`: Obtener todas las características.

### Visitas

-   `GET /visit`: Obtener todas las visitas.
-   `PUT /visit/pending/{visit}`: Marcar visita como pendiente.
-   `PUT /visit/visited/{visit}`: Marcar visita como realizada.
-   `POST /visit/{house}`: Crear una visita.
-   `DELETE /visit/delete/{visit_id}`: Eliminar una visita.

### Notificaciones

-   `GET /notifications`: Obtener todas las notificaciones.
-   `POST /notifications/{notify}`: Marcar notificación como leída.

### CSRF Token

-   `GET /csrf-token`: Para obtener el token CSRF para formularios seguros.

## Filtros de búsquedas

#### La ruta `GET /houses` permite aplicar los siguientes filtros en las solicitudes:

-   **id:** Filtra por ID de la tabla houses.
-   **features:** Filtra por características específicas.
-   **maxPrice:** Precio máximo de la tabla houses.
-   **minPrice:** Precio mínimo de la tabla houses.
-   **minSize:** Tamaño mínimo de la tabla houses.
-   **maxSize:** Tamaño máximo de la tabla houses.
-   **quarter:** Filtra por número de cuartos.
-   **bathroom:** Filtra por número de baños.
-   **search:** Permite buscar por palabras clave.
-   **type_house:** Filtra por tipo de casa.
-   **published:** Filtra por casas publicadas.
-   **limit:** Limita la cantidad de resultados.
-   **orderBy:** Ordena los resultados por el campo `id`.
-   **orderByViewed:** Ordena los resultados por el campo `viewed`.

#### La ruta `GET /notifications` permite aplicar los siguientes filtros en las solicitudes:

-   **limit:** Limita la cantidad de resultados.

#### La ruta `GET /users` permite aplicar los siguientes filtros en las solicitudes:

-   **id:** Filtra por ID de la tabla users.
-   **email:** Filtra por email de la tabla users.
-   **name:** Filtra por name de la tabla users.
-   **role:** Filtra por role de la tabla users.
-   **limit:** Limita la cantidad de resultados.

#### La ruta `GET /visit` permite aplicar los siguientes filtros en las solicitudes:

-   **id:** Filtra por ID de la tabla visits.
-   **graphic:** Solicitud especial para graficos al crear un conteo general de la tabla visits.
-   **search:** Filtra por name de la tabla visits.
-   **visited:** Filtra por los datos ya visitados de la tabla visits.
-   **pending:** Filtra por los datos ya pendiente a visitas de la tabla visits.
-   **limit:** Limita la cantidad de resultados.

## Licencia

Este proyecto está licenciado bajo la Apache License 2.0. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Si tienes alguna pregunta o sugerencia, por favor contacta a [Nestor Daniel](mailto:trabajo.nestor.098@gmail.com).

---

¡Gracias por usar Real State Villa!

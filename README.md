# CommunityHub Backend

Backend de la Plataforma Comunitaria de Actividades y Eventos, desarrollado con Express.js, MongoDB y preparado para integraciones Serverless.

## Tecnologías

- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & bcryptjs para autenticación
- CORS & dotenv

## Arquitectura

El proyecto sigue una estructura limpia:
- `src/app.js`: Configuración de middlewares y servidor Express.
- `src/server.js`: Punto de entrada y conexión a la base de datos.
- `src/controllers/`: Lógica de cada endpoint.
- `src/middlewares/`: Funciones interceptoras (autenticación, validación, subida de archivos).
- `src/models/`: Esquemas de base de datos de MongoDB.
- `src/routes/`: Definición de los endpoints de la API.

## Instalación

1. Clona el repositorio.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Copia el archivo `.env.example` a `.env` y configura tus variables de entorno.
4. Ejecuta el servidor:
   ```bash
   npm run dev
   ```

## Endpoints de la API (Rutas para el Frontend)

A continuación se listan todas las rutas disponibles en la API que pueden ser consumidas por el frontend.

### Autenticación (`/api/auth`)
- `POST /api/auth/register`: Registrar un nuevo usuario.
- `POST /api/auth/login`: Iniciar sesión.
- `GET /api/auth/me`: Obtener el perfil del usuario autenticado.
- `POST /api/auth/logout`: Cerrar sesión.

### Usuarios (`/api/users`)
- `GET /api/users/`: Obtener todos los usuarios.
- `GET /api/users/:id`: Obtener un usuario por ID.
- `PUT /api/users/:id`: Actualizar un usuario.
- `DELETE /api/users/:id`: Eliminar un usuario.

### Categorías (`/api/categories`)
- `GET /api/categories/`: Obtener todas las categorías.
- `POST /api/categories/`: Crear una categoría (Admin).
- `PUT /api/categories/:id`: Actualizar una categoría (Admin).
- `DELETE /api/categories/:id`: Eliminar una categoría (Admin).

### Eventos (`/api/events`)
- `GET /api/events/`: Obtener todos los eventos.
- `GET /api/events/:id`: Obtener un evento por ID.
- `POST /api/events/`: Crear un evento.
- `PUT /api/events/:id`: Actualizar un evento.
- `DELETE /api/events/:id`: Eliminar un evento.

### Favoritos (`/api`)
- `POST /api/events/:id/favorite`: Añadir un evento a favoritos.
- `DELETE /api/events/:id/favorite`: Eliminar un evento de favoritos.
- `GET /api/users/me/favorites`: Obtener los eventos favoritos del usuario autenticado.

### Registro a Eventos (`/api`)
- `POST /api/events/:id/register`: Registrarse en un evento.
- `DELETE /api/events/:id/register`: Cancelar el registro a un evento.
- `POST /api/events/:id/certificate`: Solicitar certificado de un evento.
- `GET /api/users/me/registrations`: Obtener los registros del usuario autenticado.
- `GET /api/events/:id/participants`: Obtener los participantes de un evento (Organizador).

### Estadísticas (`/api/stats`)
- `GET /api/stats/`: Obtener estadísticas generales.

### Notificaciones (`/api`)
- `GET /api/users/me/notifications`: Obtener las notificaciones del usuario autenticado.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

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

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

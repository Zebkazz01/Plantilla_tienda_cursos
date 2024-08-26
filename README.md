# Tienda de Cursos

Bienvenido al repositorio de la Tienda de Cursos, una plantilla completa y funcional para la creación de una tienda en línea de cursos. Este proyecto incluye tanto la interfaz de usuario como las funcionalidades backend, integradas a través de una API REST robusta y eficiente.

## Descripción del Proyecto

La Tienda de Cursos es una aplicación web diseñada para facilitar la compra y venta de cursos en línea. Los usuarios pueden explorar una amplia variedad de cursos, realizar búsquedas específicas y adquirir los cursos de su interés. La aplicación está construida con una arquitectura moderna que separa claramente el frontend del backend, permitiendo una mayor flexibilidad y escalabilidad.

### Características Principales

- **Navegación de Cursos**: Los usuarios pueden navegar a través de una lista de cursos categorizados.
- **Búsqueda Avanzada**: Funcionalidad de búsqueda para encontrar cursos específicos por nombre, categoría o instructor.
- **Gestión de Usuarios**: Registro e inicio de sesión de usuarios, con perfiles personalizados.
- **Carrito de Compras**: Los usuarios pueden agregar cursos a su carrito y proceder al pago.
- **API REST**: Endpoints para la gestión de cursos, usuarios y transacciones, facilitando la integración con otros servicios y aplicaciones.

### Tecnologías Utilizadas

- **Frontend**: React.js para una experiencia de usuario dinámica y responsiva.
- **Backend**: Node.js y Express para un servidor eficiente y escalable.
- **Base de Datos**: MongoDB para el almacenamiento de datos flexible y escalable.
- **Autenticación**: JWT (JSON Web Tokens) para la autenticación segura de usuarios.
- **API REST**: Implementación de endpoints RESTful para la interacción entre el frontend y el backend.

### Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

- **/client**: Contiene el código del frontend.
- **/server**: Contiene el código del backend y la API REST.
- **/config**: Archivos de configuración para la base de datos y otros servicios.
- **/models**: Modelos de datos para MongoDB.
- **/routes**: Definición de las rutas de la API REST.
- **/controllers**: Lógica de negocio y controladores de la API.

### Instalación y Configuración

Para instalar y configurar el proyecto localmente, sigue estos pasos:

1. Clona el repositorio:
    ```bash
    git clone https://github.com/tu-usuario/tienda-de-cursos.git
    ```
2. Navega al directorio del proyecto:
    ```bash
    cd tienda-de-cursos
    ```
3. Instala las dependencias del servidor y del cliente:
    ```bash
    npm install
    cd client
    npm install
    cd ..
    ```
4. Configura las variables de entorno en un archivo `.env` en la raíz del proyecto:
    ```env
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=tu_contraseña
    API_KEY=tu_api_key
    ```
5. Inicia el servidor y el cliente:
    ```bash
    npm run dev
    ```
    
## Uso

Para usar la aplicación, abre tu navegador y navega a `http://localhost:3000`. Desde allí, podrás explorar los cursos disponibles, registrarte como usuario y realizar compras.

## API REST

La API REST proporciona los siguientes endpoints:

- **GET /api/cursos**: Obtiene una lista de todos los cursos.
- **GET /api/cursos/:id**: Obtiene los detalles de un curso específico.
- **POST /api/cursos**: Crea un nuevo curso (requiere autenticación).
- **PUT /api/cursos/:id**: Actualiza un curso existente (requiere autenticación).
- **DELETE /api/cursos/:id**: Elimina un curso (requiere autenticación).

Para más detalles sobre cómo usar la API, consulta la [documentación de la API](docs/api.md).

## Contribuciones

Las contribuciones son bienvenidas. Por favor, sigue estos pasos para contribuir:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -am 'Añadir nueva funcionalidad'`).
4. Sube tus cambios (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

Si tienes alguna pregunta o necesitas ayuda, no dudes en abrir un issue o contactar al mantenedor del proyecto.

¡Gracias por tu interés en contribuir a este proyecto!

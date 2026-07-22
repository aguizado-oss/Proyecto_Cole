
  # Diseñar Portal Universitario

  This is a code bundle for Diseñar Portal Universitario. The original project is available at https://www.figma.com/design/tM3mbehVjM6SGiXwl9y7zs/Dise%C3%B1ar-Portal-Universitario.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Consulta de DNI en pagos

  1. Crea un archivo `.env` tomando `.env.example` como referencia.
  2. Coloca el token de tu proveedor en `RENIEC_API_TOKEN`.
  3. Inicia el proyecto con `npm run dev` y abre la sección **Pagos**.

  La configuración predeterminada usa el endpoint de JSON.pe. Su plan de prueba incluye 100 créditos por 30 días, pero requiere crear una cuenta y generar un token. El token se consume desde el middleware de Vite y nunca se envía al navegador. Para producción, el hosting debe implementar la misma ruta `GET /api/reniec/:dni` en una función o servidor; un despliegue puramente estático no puede proteger la credencial.

  La consulta completa automáticamente nombres, apellido paterno y apellido materno.

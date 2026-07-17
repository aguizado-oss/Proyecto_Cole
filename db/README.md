# Base de datos MySQL

Los archivos `schema.sql` y `seed.sql` son la fuente de verdad del modelo académico y deben ejecutarse en ese orden sobre MySQL 8.

Este repositorio es actualmente una aplicación Vite ejecutada en el navegador. No contiene backend, ORM, archivo `.env` ni cliente MySQL, por lo que la aplicación todavía no debe conectarse directamente a la base de datos. Hacerlo desde React expondría las credenciales.

Cuando se incorpore el backend, debe leer la conexión desde `DATABASE_URL` o desde `DB_HOST`, `DB_USER`, `DB_PASSWORD` y `DB_NAME`. Después se podrán ejecutar los scripts con el cliente MySQL instalado:

```sh
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" < db/schema.sql
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" < db/seed.sql
```

No se generó un esquema Prisma/Drizzle/TypeORM porque el proyecto no usa actualmente ningún ORM.

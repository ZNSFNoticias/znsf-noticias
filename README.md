# ZNSF Noticias

Proyecto de diario digital moderno para la comunidad de San Fernando, Zona Norte GBA.

## Tecnologías
- Next.js (React)
- Supabase (backend y base de datos)

## Estructura principal
- `/pages`: páginas del sitio
- `/components`: componentes reutilizables
- `/styles`: hojas de estilo
- `/lib`: configuración y utilidades (incluye Supabase)
- `/public`: imágenes y archivos públicos

## Primeros pasos
1. Instala dependencias:
   ```
   npm install
   ```
2. Configura tu proyecto Supabase y copia las claves en `.env.local`.
3. Asegúrate de que la función de incremento de vistas está creada en la base de datos (ver abajo).
4. Ejecuta el proyecto:
   ```
   npm run dev
   ```


---

## Contador de vistas 🧮
La aplicación utiliza un campo `vistas` en la tabla `noticias` para mostrar cuántas veces se leyó cada artículo. El frontend intenta sumar una unidad cada vez que se abre una noticia y consulta periódicamente el valor para mantenerlo al día.

### Paso en la base de datos
La llamada original usa una función RPC llamada `incrementar_vista`. Si no la tienes creada, copia y ejecuta el siguiente SQL en tu proyecto Supabase (`SQL editor`):

```sql
create or replace function incrementar_vista(noticia_id bigint)
returns void language plpgsql security definer as $$
begin
  update public.noticias
  set vistas = coalesce(vistas,0) + 1
  where id = noticia_id;
end;
$$;
```

Esta función es opcional: el código del frontend también incluye un mecanismo de reserva que utiliza el método `increment()` de supabase-js, por lo que la aplicación seguirá contando vistas aunque la RPC no exista.

### Ajustes en el cliente
Se han agregado comprobaciones para convertir cadenas numéricas devueltas por Supabase a `Number` y registrar errores en la consola. Si el contador se muestra "fijo", abre la consola de tu navegador para ver si hay mensajes relacionados.


---


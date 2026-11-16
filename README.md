# Backoffice — Autores y libros (React)

Backoffice hecho con React 19, TypeScript y Vite para el Seminario 8 de EA. Es la versión en React del
backoffice de Angular del Seminario 6: usa **la misma API REST** y tiene las mismas pantallas (listar, buscar,
paginar, crear, editar y borrar autores y libros, con vista en tabla o en tarjetas).

La explicación de cómo funciona por dentro (JSX, props, hooks, efectos, estado global, router...) está
en [GUIA.md](GUIA.md). Hay un ejercicio propuesto en [EJERCICIO.md](EJERCICIO.md).

## Requisitos

- [Node.js](https://nodejs.org/) 22.12 o superior.
- [MongoDB](https://www.mongodb.com/), local o en Atlas, para el backend.
- El backend arrancado (carpeta `EA-Seminari8-React-BackOffice-API`, es la API del Seminario 5).
- Recomendado: VS Code y la extensión [React Developer Tools](https://react.dev/learn/react-developer-tools) en el navegador.

## Cómo arrancarlo

Hacen falta dos terminales: una para la API y otra para React.

**1. Backend**

Con MongoDB ya arrancado (o con la URL de Atlas puesta en el `.env`):

```
cd EA-Seminari8-React-BackOffice-API
npm install
cp .env.example .env
npm run seed
npm run dev
```

La API queda en http://localhost:1337 y su documentación (Swagger) en http://localhost:1337/api-docs.
`npm run seed` mete 5 autores y 12 libros de ejemplo; con `npm run seed -- --reset` se vuelven a poner
desde cero. Todos los autores de ejemplo tienen la contraseña `seminari5`.

**2. Frontend (este proyecto)**

```
cd EA-Seminari8-React-BackOffice
npm install
npm run dev
```

Y se abre la dirección que enseña Vite (normalmente http://localhost:5173).

## Configuración: un solo fichero

Para cambiar la dirección de la API se toca aquí y en ningún sitio más:

```typescript
// src/config/environment.ts
export const environment = {
  apiUrl: 'http://localhost:1337',
};
```

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con Vite. La página se actualiza sola al guardar |
| `npm run build` | Comprueba los tipos (`tsc`) y compila la versión de producción en `dist/` |
| `npm run preview` | Sirve el contenido de `dist/` para probar la versión de producción |
| `npm test` | Pasa los tests con Vitest una vez |
| `npm run lint` | Analiza `src/` con Oxlint |

## Pantallas

| Ruta | Pantalla |
|---|---|
| `/authors` | Lista de autores (en tabla o en tarjetas): buscador, paginación, editar y borrar |
| `/authors/new` | Nuevo autor |
| `/authors/:id/edit` | Editar autor |
| `/books` | Lista de libros (en tabla o en tarjetas): buscador, paginación, editar y borrar |
| `/books/new` | Nuevo libro |
| `/books/:id/edit` | Editar libro |

El texto del buscador y la página están en la URL (`/authors?q=cervantes&page=2`).

## Estructura del proyecto

```
src/
├── components/
│   ├── Layout.tsx         # barra de arriba + <Outlet />, común a todas las rutas
│   ├── Navbar.tsx         # menú de arriba
│   ├── AuthorsList.tsx    # lista de autores
│   ├── AuthorForm.tsx     # crear y editar autores
│   ├── AuthorCard.tsx     # autor en modo tarjeta (y RoleBadge)
│   ├── BooksList.tsx      # lista de libros
│   ├── BookForm.tsx       # crear y editar libros
│   ├── Pagination.tsx     # paginación, componente hijo de las dos listas
│   ├── ConfirmModal.tsx   # ventana para confirmar antes de borrar
│   ├── ViewToggle.tsx     # botones para ver las listas en tabla o en tarjetas
│   └── Field.tsx          # etiqueta + input + mensaje de error de los formularios
├── hooks/
│   ├── useApiList.ts      # pide una lista a la API (useEffect + useReducer)
│   ├── useListControls.ts # búsqueda y paginación guardadas en la URL (useMemo)
│   └── useForm.ts         # formularios controlados con validación (useReducer)
├── services/
│   ├── http.ts            # fetch común: errores, JSON y 204
│   ├── author.service.ts  # getAuthors, getAuthor, createAuthor, updateAuthor, deleteAuthor
│   └── book.service.ts    # getBooks, getBook, createBook, updateBook, deleteBook
├── context/
│   └── ToastContext.tsx   # avisos globales con la Context API
├── stores/
│   └── viewMode.ts        # estado global (Nanostores): lista o tarjetas
├── models/                # Author, Book y sus tipos
├── utils/
│   ├── format.ts          # languageName, truncate, formatDate, formatPrice, initials
│   ├── api-error.ts       # pasa un error capturado a un texto para la pantalla
│   └── remove-empty.ts    # quita los campos vacíos antes de enviar un formulario
├── config/environment.ts  # URL de la API
├── App.tsx                # rutas
├── main.tsx               # punto de entrada: BrowserRouter + providers
└── index.css              # estilos
public/                    # ficheros estáticos (favicon)
```

## Librerías

Se ha intentado usar lo mínimo: solo hay una librería de más aparte de React y el router.

| Librería | Para qué se usa |
|---|---|
| [React](https://react.dev/) 19 | Pintar la interfaz con componentes |
| [React Router](https://reactrouter.com/) (`react-router-dom` 7) | Rutas, enlaces y parámetros de la URL |
| [Nanostores](https://github.com/nanostores/nanostores) + `@nanostores/react` | Estado global muy pequeño (`atom` y `useStore`) |
| [Vite](https://vite.dev/) | Servidor de desarrollo y compilación |
| [Vitest](https://vitest.dev/) | Tests |
| [Oxlint](https://oxc.rs/docs/guide/usage/linter) | Linter |

Los formularios y la validación están hechos a mano (sin React Hook Form ni Zod) y las peticiones con
`fetch` (sin axios), para que se vea qué hace cada cosa.

## Cosas de la API que hay que saber

- Editar es un PUT y la API pide siempre los campos obligatorios. En los autores eso incluye la
  contraseña: al editar hay que escribirla otra vez y se guarda la que se escriba.
- Un campo opcional que se deja vacío al editar no se borra. La API rechaza los valores vacíos, así
  que el formulario no los envía y la API deja el valor que tenía. Los tags sí se pueden vaciar: si se
  desmarcan todos se envía una lista vacía.
- Borrar un autor no borra sus libros: se quedan sin ese autor (si era el único, en la lista sale
  "Sin autores").
- Los mensajes de error de validación que devuelve la API (422) vienen en inglés, de Joi.
- Si la API no está arrancada, las pantallas enseñan "No se puede conectar con la API".

## Docker, entornos e imagen publicada

Hay dos ficheros de configuracion y solo uno se toca segun el entorno:

| Entorno | Fichero | Cuando se usa |
|---|---|---|
| Local | `src/config/environment.local.ts` | `npm run dev`, y la imagen con `--build-arg APP_ENV=local` |
| Produccion | `src/config/environment.production.ts` | `npm run build` (y por tanto la imagen publicada) |

`src/config/environment.ts` elige uno u otro con el modo de compilacion de Vite, asi que el resto del
codigo sigue importando `environment` sin enterarse. **En produccion solo se edita
`environment.production.ts`** (la `apiUrl`): se commitea y el workflow reconstruye la imagen en ese push.

```
npm run dev                                  # local, con environment.local.ts
docker build -t backoffice-react .           # imagen de produccion
docker run --rm -p 4300:80 backoffice-react
docker build --build-arg APP_ENV=local -t backoffice-react:local .
```

La imagen son dos etapas: `node:24-alpine` compila con Vite y `nginx:1.29-alpine` sirve el estatico con
su configuracion por defecto, sin `nginx.conf` propio. Consecuencia: solo se llega a las rutas internas
de React Router navegando desde `/`; al recargar una ruta profunda el servidor devuelve 404, y los
ficheros con hash no llevan cache larga.

El workflow `.github/workflows/ci.yml` (en la raiz del repo) corre lint, tests y build en los push a
`main` y en los pull request hacia `main`, y publica la imagen del backoffice en GitHub Container
Registry:

| Etiqueta | Cuando |
|---|---|
| `:latest` | En cada push a `main` y al empujar un tag `v*` |

Los pull request compilan y buildean la imagen, pero no publican. La API de este repo
(`EA-Seminari8-React-BackOffice-API`) no se publica como imagen: solo el backoffice lo hace.

// Valores de PRODUCCION. Este es el unico fichero que hay que tocar para apuntar la app a otro
// servidor: se cambia la direccion, se commitea y el workflow reconstruye la imagen en ese push.
//
// Ojo: las resuelve el navegador, no el contenedor, asi que tiene que ser una direccion alcanzable
// desde el equipo donde se abre la app.
export const production = {
  apiUrl: 'http://localhost:1337',
} as const;

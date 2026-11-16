// Valores para trabajar en tu maquina: `npm run dev` y `npm run build` sin --mode.
// La app los elige desde environment.ts segun el modo de compilacion.
export const local = {
  // URL de la API. En desarrollo la API corre en tu equipo con `npm run dev`.
  apiUrl: 'http://localhost:1337',
} as const;

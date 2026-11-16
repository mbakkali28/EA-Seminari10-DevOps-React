// Ajustes de la app. Un solo punto de entrada para el resto del codigo, dos ficheros de valores:
//
//   local       -> src/config/environment.local.ts       (`npm run dev`, imagen con APP_ENV=local)
//   produccion  -> src/config/environment.production.ts  (`npm run build`, imagen por defecto)
//
// El modo lo pone Vite: `vite build` compila en modo production y el servidor de desarrollo en modo
// development, asi que en el codigo nunca hay que cambiar ningun import.
import { local } from './environment.local';
import { production } from './environment.production';

export type Environment = {
  apiUrl: string;
};

export const environment: Environment = import.meta.env.MODE === 'production' ? production : local;

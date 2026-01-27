// prisma/prisma.usuario.config.ts:

import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  // Estamos en la carpeta prisma/, así que basta con el nombre:
  schema: 'esquema-usuario.prisma',
  migrations: {
    path: 'migrations-usuario',
  },
  datasource: {
    url: env('DATABASE_URL_USUARIO'),
  },
})

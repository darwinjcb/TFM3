// prisma/prisma.carrera.config.ts:

import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'esquema-carrera.prisma',
  migrations: {
    path: 'migrations-carrera',
  },
  datasource: {
    url: env('DATABASE_URL_CARRERA'),
  },
})

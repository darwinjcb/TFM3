// prisma/prisma.profesor.config.ts:

import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'esquema-profesor.prisma',
  migrations: {
    path: 'migrations-profesor',
  },
  datasource: {
    url: env('DATABASE_URL_PROFESOR'),
  },
})

// prisma/utils/env.ts
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

export function cargarEnv() {
    // Carga .env desde la raíz del proyecto

    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) dotenv.config({ path: envPath });
}
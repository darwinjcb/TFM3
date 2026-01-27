// prisma/seed.profesor.ts:

import 'dotenv/config';
import { seedProfesor } from './seeds/profesor.seed';

async function main() {
  console.log('🚀 Ejecutando seed de PROFESOR...');
  await seedProfesor();
}

main().catch((e) => {
  console.error('❌ Error seed PROFESOR:', e);
  process.exit(1);
});

// prisma/seed.carrera.ts:
import 'dotenv/config';
import { seedCarrera } from './seeds/carrera.seed';

async function main() {
  console.log('🚀 Ejecutando seed de CARRERA...');
  await seedCarrera();
}

main().catch((e) => {
  console.error('❌ Error seed CARRERA:', e);
  process.exit(1);
});

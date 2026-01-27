// prisma/seed.usuario.ts:

import 'dotenv/config';
import { seedUsuario } from './seeds/usuario.seed';

async function main() {
  console.log('🚀 Ejecutando seed de USUARIO...');
  await seedUsuario();
}

main().catch((e) => {
  console.error('❌ Error seed USUARIO:', e);
  process.exit(1);
});

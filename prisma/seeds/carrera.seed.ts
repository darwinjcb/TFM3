// prisma/seeds/carrera.seed.ts:
import { PrismaClient as PrismaCarreraClient } from '@prisma/client-carrera';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

export async function seedCarrera() {
  const url = process.env.DATABASE_URL_CARRERA;
  if (!url) throw new Error('Falta DATABASE_URL_CARRERA en el .env');

  const pool = new Pool({ connectionString: url });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaCarreraClient({ adapter });

  try {
    console.log('🌱 Seed de CARRERA...');

    const carreras = [
      { nombre: 'Desarrollo de Software', descripcion: 'Carrera de tecnología', facultad: 'Tecnología' }
    ];

    for (const c of carreras) {
      await prisma.carrera.upsert({
        where: { nombre: c.nombre },
        update: { descripcion: c.descripcion, facultad: c.facultad },
        create: c,
      });
    }

    const carreraDS = await prisma.carrera.findUnique({
      where: { nombre: 'Desarrollo de Software' },
    });
    if (!carreraDS) throw new Error('No se encontró la carrera Desarrollo de Software');

    const ciclos = [
      { numero: 1, nombre: 'Primer ciclo' },
      { numero: 2, nombre: 'Segundo ciclo' },
    ];

    for (const ciclo of ciclos) {
      const existe = await prisma.ciclo.findFirst({
        where: { carreraId: carreraDS.id, numero: ciclo.numero },
      });

      if (!existe) {
        await prisma.ciclo.create({
          data: { numero: ciclo.numero, nombre: ciclo.nombre, carreraId: carreraDS.id },
        });
      }
    }

    const ciclo1 = await prisma.ciclo.findFirst({
      where: { carreraId: carreraDS.id, numero: 1 },
    });
    if (!ciclo1) throw new Error('No se encontró el ciclo 1');

    const materiasCiclo1 = [
      { nombre: 'Programación I', codigo: 'DS101', creditos: 4 },
      { nombre: 'Bases de Datos I', codigo: 'DS102', creditos: 4 },
      { nombre: 'Lógica de Programación', codigo: 'DS103', creditos: 3 },
    ];

    for (const m of materiasCiclo1) {
      await prisma.materia.upsert({
        where: { codigo: m.codigo },
        update: { nombre: m.nombre, creditos: m.creditos, carreraId: carreraDS.id, cicloId: ciclo1.id },
        create: { ...m, carreraId: carreraDS.id, cicloId: ciclo1.id },
      });
    }

    console.log('✅ Seed CARRERA completado.');
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

// prisma/seeds/profesor.seed.ts:
import { PrismaClient as PrismaProfesorClient } from '@prisma/client-profesor';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

export async function seedProfesor() {
  const url = process.env.DATABASE_URL_PROFESOR;
  if (!url) throw new Error('Falta DATABASE_URL_PROFESOR en el .env');

  const pool = new Pool({ connectionString: url });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaProfesorClient({ adapter });

  try {
    console.log('🌱 Seed de PROFESOR...');

    // Creamos 1 profesor base (email es UNIQUE, aquí sí upsert)
    const profesor = await prisma.profesor.upsert({
      where: { email: 'docente@t1m3.com' },
      update: { activo: true },
      create: {
        nombres: 'Docente',
        apellidos: 'Base',
        email: 'docente@t1m3.com',
        telefono: '0000000000',
        activo: true,
      },
    });

    // Títulos base (no hay unique, usamos findFirst)
    const titulos = [
      { nombre: 'Ingeniero en Sistemas', institucion: 'Universidad X', anioObtencion: 2020 },
      { nombre: 'Magíster en Software', institucion: 'Universidad Y', anioObtencion: 2022 },
    ];

    for (const t of titulos) {
      const existe = await prisma.titulo.findFirst({
        where: {
          profesorId: profesor.id,
          nombre: t.nombre,
          institucion: t.institucion ?? null,
          anioObtencion: t.anioObtencion ?? null,
        },
      });

      if (!existe) {
        await prisma.titulo.create({
          data: {
            ...t,
            profesorId: profesor.id,
          },
        });
      }
    }

    console.log('✅ Seed PROFESOR completado.');
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

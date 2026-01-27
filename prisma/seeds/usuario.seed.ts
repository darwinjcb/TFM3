// prisma/seeds/usuario.seed.ts
// prisma/seeds/usuario.seed.ts
import { PrismaClient as PrismaUsuarioClient } from '@prisma/client-usuario';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

export async function seedUsuario() {
  const url = process.env.DATABASE_URL_USUARIO;
  if (!url) throw new Error('Falta DATABASE_URL_USUARIO en el .env');

  const pool = new Pool({ connectionString: url });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaUsuarioClient({ adapter });

  try {
    console.log('🌱 Seeding USUARIO (RBAC)...');

    const roles = [
      { nombre: 'ADMIN', descripcion: 'Rol administrador', esSistema: true },
      { nombre: 'DOCENTE', descripcion: 'Rol docente', esSistema: true },
      { nombre: 'ESTUDIANTE', descripcion: 'Rol estudiante', esSistema: true },
    ];

    for (const r of roles) {
      await prisma.rol.upsert({
        where: { nombre: r.nombre },
        update: {},
        create: r,
      });
    }

    const permisos = [
      { codigo: 'USUARIO_CREAR', descripcion: 'Crear usuarios', categoria: 'USUARIOS' },
      { codigo: 'USUARIO_LEER', descripcion: 'Leer usuarios', categoria: 'USUARIOS' },
      { codigo: 'USUARIO_EDITAR', descripcion: 'Editar usuarios', categoria: 'USUARIOS' },
      { codigo: 'USUARIO_ELIMINAR', descripcion: 'Eliminar usuarios', categoria: 'USUARIOS' },

      { codigo: 'ROL_CREAR', descripcion: 'Crear roles', categoria: 'SEGURIDAD' },
      { codigo: 'ROL_LEER', descripcion: 'Leer roles', categoria: 'SEGURIDAD' },
      { codigo: 'ROL_EDITAR', descripcion: 'Editar roles', categoria: 'SEGURIDAD' },
      { codigo: 'ROL_ELIMINAR', descripcion: 'Eliminar roles', categoria: 'SEGURIDAD' },
    ];

    for (const p of permisos) {
      await prisma.permiso.upsert({
        where: { codigo: p.codigo },
        update: { descripcion: p.descripcion, categoria: p.categoria },
        create: p,
      });
    }

    const rolAdmin = await prisma.rol.findUnique({ where: { nombre: 'ADMIN' } });
    if (!rolAdmin) throw new Error('No se encontró el rol ADMIN');

    const permisosDb = await prisma.permiso.findMany();

    await prisma.rolPermiso.createMany({
      data: permisosDb.map((permiso) => ({
        rolId: rolAdmin.id,
        permisoId: permiso.id,
      })),
      skipDuplicates: true,
    });

    await prisma.usuario.upsert({
      where: { email: 'admin@t1m3.com' },
      update: { rolId: rolAdmin.id, activo: true },
      create: {
        nombre: 'Administrador',
        email: 'admin@t1m3.com',
        passwordHash: 'SEED_TEMP_HASH',
        tipoUsuario: 'OTRO',
        rolId: rolAdmin.id,
        activo: true,
      },
    });

    console.log('✅ Seed USUARIO completado.');
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

// src/modulo-usuario/servicio-usuario.service.ts
import { Injectable } from '@nestjs/common';
import { ServicioPrismaUsuario } from '../modulo-prisma/servicio-usuario/servicio-prisma-usuario.service';
import { ServicioPrismaCarrera } from '../modulo-prisma/servicio-carrera/servicio-prisma-carrera.service';
import { CreateUsuarioDto } from './create-usuario.dto';
import { UpdateUsuarioDto } from './update-usuario.dto';

@Injectable()
export class ServicioUsuario {
  constructor(
    private readonly prisma: ServicioPrismaUsuario,
    private readonly prismaCarrera: ServicioPrismaCarrera,
  ) { }

  // ============================
  // PARTE 1 – CONSULTA DERIVADA
  // ============================
  // "Listar todos los estudiantes activos junto con su carrera."
  async listarEstudiantesActivosConCarrera() {
    const estudiantes = await this.prisma.usuario.findMany({
      where: {
        activo: true,
        rol: { nombre: 'ESTUDIANTE' },
        inscripciones: { some: { activo: true } },
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        tipoUsuario: true,
        rolId: true,
        profesorId: true,
        activo: true,
        creadoEn: true,
        actualizadoEn: true,
        inscripciones: {
          where: { activo: true },
          select: {
            id: true,
            carreraId: true,
            cicloId: true,
            fechaInicio: true,
            activo: true,
          },
        },
      },
      orderBy: { id: 'asc' },
    });

    const carreraIds = [
      ...new Set(estudiantes.flatMap((e) => e.inscripciones.map((i) => i.carreraId))),
    ];

    if (carreraIds.length === 0) {
      return estudiantes.map((e) => ({ ...e, carrera: null }));
    }

    const carreras = await this.prismaCarrera.carrera.findMany({
      where: { id: { in: carreraIds as number[] } },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        facultad: true,
      },
    });

    const carreraMap = new Map(carreras.map((c) => [c.id, c]));

    return estudiantes.map((e) => {
      const inscripcionActiva = e.inscripciones[0];
      const carrera =
        inscripcionActiva?.carreraId !== undefined
          ? carreraMap.get(inscripcionActiva.carreraId) ?? null
          : null;

      return { ...e, carrera };
    });
  }

  // ============================
  // PARTE 2 – OPERADORES LÓGICOS (AND)
  // ============================
  async buscarEstudiantesActivosPorCarreraYCiclo(carreraId: number, cicloId: number) {
    return this.prisma.usuario.findMany({
      where: {
        AND: [
          { activo: true },
          { rol: { nombre: 'ESTUDIANTE' } },
          {
            inscripciones: {
              some: {
                activo: true,
                carreraId,
                cicloId,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        activo: true,
        rolId: true,
        inscripciones: {
          where: { activo: true, carreraId, cicloId },
          select: {
            id: true,
            carreraId: true,
            cicloId: true,
            fechaInicio: true,
            activo: true,
          },
        },
      },
      orderBy: { id: 'asc' },
    });
  }

  // ============================
  // PARTE 3 – CONSULTA NATIVA SQL
  // ============================
  // Reporte: Nombre estudiante, Carrera, Total materias matriculadas (DESC)
  async reporteMateriasMatriculadas() {
    // SQL NATIVO ejecutado en BD-Carrera
    const rows = await this.prismaCarrera.$queryRaw<
      Array<{
        inscripcionId: number;
        carreraId: number;
        carrera: string;
        totalMaterias: number;
      }>
    >`
      SELECT
        m."inscripcionId" AS "inscripcionId",
        m."carreraId"     AS "carreraId",
        c."nombre"        AS "carrera",
        COUNT(*)::int     AS "totalMaterias"
      FROM "Materia" m
      JOIN "Carrera" c ON c."id" = m."carreraId"
      WHERE m."inscripcionId" IS NOT NULL
        AND m."activo" = true
      GROUP BY m."inscripcionId", m."carreraId", c."nombre"
      ORDER BY "totalMaterias" DESC;
    `;

    if (rows.length === 0) return [];

    // Traer inscripciones en BD-Usuario para mapear inscripcionId -> usuarioId
    const inscripcionIds = [...new Set(rows.map((r) => r.inscripcionId))];

    const inscripciones = await this.prisma.inscripcion.findMany({
      where: { id: { in: inscripcionIds } },
      select: { id: true, usuarioId: true },
    });

    const insMap = new Map(inscripciones.map((i) => [i.id, i.usuarioId]));

    // Agrupar por usuario + carrera
    const agg = new Map<string, { usuarioId: number; carrera: string; totalMaterias: number }>();

    for (const r of rows) {
      const usuarioId = insMap.get(r.inscripcionId);
      if (!usuarioId) continue;

      const key = `${usuarioId}-${r.carreraId}`;
      const prev = agg.get(key);

      if (!prev) {
        agg.set(key, { usuarioId, carrera: r.carrera, totalMaterias: r.totalMaterias });
      } else {
        prev.totalMaterias += r.totalMaterias;
      }
    }

    const agregados = [...agg.values()];
    if (agregados.length === 0) return [];

    // Traer nombres de estudiantes
    const usuarioIds = [...new Set(agregados.map((a) => a.usuarioId))];

    const usuarios = await this.prisma.usuario.findMany({
      where: { id: { in: usuarioIds } },
      select: { id: true, nombre: true },
    });

    const userMap = new Map(usuarios.map((u) => [u.id, u.nombre]));

    // Respuesta final ordenada DESC por totalMaterias
    const reporte = agregados.map((a) => ({
      estudiante: userMap.get(a.usuarioId) ?? `Usuario ${a.usuarioId}`,
      carrera: a.carrera,
      totalMaterias: a.totalMaterias,
    }));

    reporte.sort((x, y) => y.totalMaterias - x.totalMaterias);

    return reporte;
  }

  // ============================
  // CRUD EXISTENTE
  // ============================

  obtenerTodos() {
    return this.prisma.usuario.findMany();
  }

  obtenerPorId(id: number) {
    return this.prisma.usuario.findUnique({
      where: { id },
    });
  }

  async crear(data: CreateUsuarioDto) {
    return this.prisma.usuario.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        passwordHash: data.password,
        rolId: data.rolId,
        profesorId: data.profesorId ?? null,
      },
    });
  }

  async actualizar(id: number, data: UpdateUsuarioDto) {
    const updateData: Partial<{
      nombre: string;
      email: string;
      passwordHash: string;
      rolId: number;
      profesorId: number | null;
    }> = {};

    if (data.nombre !== undefined) updateData.nombre = data.nombre;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.password !== undefined) updateData.passwordHash = data.password;
    if (data.rolId !== undefined) updateData.rolId = data.rolId;
    if (data.profesorId !== undefined) updateData.profesorId = data.profesorId;

    return this.prisma.usuario.update({
      where: { id },
      data: updateData,
    });
  }

  async eliminar(id: number) {
    return this.prisma.usuario.delete({
      where: { id },
    });
  }
}

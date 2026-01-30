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
    // 1) Usuarios activos (estudiantes) + su inscripción activa (para obtener carreraId)
    const estudiantes = await this.prisma.usuario.findMany({
      where: {
        activo: true,
        tipoUsuario: 'ESTUDIANTE',
        inscripciones: {
          some: { activo: true },
        },
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
            carreraId: true,
            cicloId: true,
            fechaInicio: true,
            activo: true,
          },
        },
      },
      orderBy: { id: 'asc' },
    });

    // 2) Tomamos los carreraId (de inscripciones activas)
    const carreraIds = [
      ...new Set(
        estudiantes
          .flatMap((e) => e.inscripciones.map((i) => i.carreraId))
          .filter((id) => id !== null && id !== undefined),
      ),
    ];

    // Si no hay carreras, devolvemos igual (pero sin carrera)
    if (carreraIds.length === 0) {
      return estudiantes.map((e) => ({ ...e, carrera: null }));
    }

    // 3) Consultamos carreras en Prisma-Carrera
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

    // 4) “Unimos” estudiante + carrera (tomando la primera inscripción activa)
    return estudiantes.map((e) => {
      const inscripcionActiva = e.inscripciones[0]; // usualmente 1 activa
      const carrera =
        inscripcionActiva?.carreraId !== undefined
          ? carreraMap.get(inscripcionActiva.carreraId) ?? null
          : null;

      return { ...e, carrera };
    });
  }

  // ============================
  // CRUD EXISTENTE (tuyo)
  // ============================

  // GET /usuarios
  obtenerTodos() {
    return this.prisma.usuario.findMany();
  }

  // GET /usuarios/:id
  obtenerPorId(id: number) {
    return this.prisma.usuario.findUnique({
      where: { id },
    });
  }

  // POST /usuarios
  async crear(data: CreateUsuarioDto) {
    return this.prisma.usuario.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        passwordHash: data.password, // luego lo cambiamos a hash
        rolId: data.rolId,
        profesorId: data.profesorId ?? null,
      },
    });
  }

  // PATCH /usuarios/:id
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
    if (data.password !== undefined) {
      updateData.passwordHash = data.password; // luego lo hasheamos
    }
    if (data.rolId !== undefined) updateData.rolId = data.rolId;
    if (data.profesorId !== undefined) updateData.profesorId = data.profesorId;

    return this.prisma.usuario.update({
      where: { id },
      data: updateData,
    });
  }

  // DELETE físico /usuarios/:id
  async eliminar(id: number) {
    return this.prisma.usuario.delete({
      where: { id },
    });
  }
}

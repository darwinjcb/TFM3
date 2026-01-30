// src/modulo-carrera/servicio-carrera.service.ts
import { Injectable } from '@nestjs/common';
import { ServicioPrismaCarrera } from '../modulo-prisma/servicio-carrera/servicio-prisma-carrera.service';
import { ServicioPrismaUsuario } from '../modulo-prisma/servicio-usuario/servicio-prisma-usuario.service';
import { CreateCarreraDto } from './create-carrera.dto';
import { UpdateCarreraDto } from './update-carrera.dto';

@Injectable()
export class ServicioCarreraService {
  constructor(
    private readonly prisma: ServicioPrismaCarrera,
    private readonly prismaUsuario: ServicioPrismaUsuario, // ✅ nuevo
  ) { }

  // GET /carreras
  obtenerTodos() {
    return this.prisma.carrera.findMany({
      orderBy: { id: 'asc' },
    });
  }

  // GET /carreras/:id
  obtenerPorId(id: number) {
    return this.prisma.carrera.findUnique({
      where: { id },
    });
  }

  // GET /carreras/:id/materias
  obtenerMateriasPorCarrera(id: number) {
    return this.prisma.materia.findMany({
      where: {
        carreraId: id,
        activo: true,
      },
      include: {
        ciclo: true,
        carrera: {
          select: { id: true, nombre: true },
        },
      },
      orderBy: { id: 'asc' },
    });
  }

  // POST /carreras
  crear(data: CreateCarreraDto) {
    return this.prisma.carrera.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion ?? null,
        facultad: data.facultad ?? null,
      },
    });
  }

  // PATCH /carreras/:id
  async actualizar(id: number, data: UpdateCarreraDto) {
    const updateData: Partial<{
      nombre: string;
      descripcion: string | null;
      facultad: string | null;
    }> = {};

    if (data.nombre !== undefined) updateData.nombre = data.nombre;
    if (data.descripcion !== undefined) updateData.descripcion = data.descripcion;
    if (data.facultad !== undefined) updateData.facultad = data.facultad;

    return this.prisma.carrera.update({
      where: { id },
      data: updateData,
    });
  }

  // DELETE /carreras/:id — BORRADO FÍSICO es
  async eliminar(id: number) {
    await this.prisma.materia.deleteMany({ where: { carreraId: id } });
    await this.prisma.ciclo.deleteMany({ where: { carreraId: id } });

    return this.prisma.carrera.delete({
      where: { id },
    });
  }

  // PARTE 4: TRANSACCIÓN (MATRICULACIÓN)
  // Reglas:
  // 1) Verificar estudiante activo (BD-Usuario)
  // 2) Verificar cupos disponibles (BD-Carrera)
  // 3) Registrar matrícula (asignar inscripcionId a Materia)
  // 4) Descontar cupo disponible
  // Si falla algo -> rollback
  async matricularEnMateria(params: {
    usuarioId: number;
    materiaId: number;
    carreraId: number;
    cicloId: number;
  }) {
    const { usuarioId, materiaId, carreraId, cicloId } = params;

    // 1) Verificar estudiante activo (BD-Usuario)
    const estudiante = await this.prismaUsuario.usuario.findUnique({
      where: { id: usuarioId },
      select: { id: true, activo: true },
    });

    if (!estudiante || !estudiante.activo) {
      throw new Error('El estudiante no existe o está inactivo.');
    }

    // 2) Buscar inscripción activa (BD-Usuario) para esa carrera y ciclo
    const inscripcion = await this.prismaUsuario.inscripcion.findFirst({
      where: {
        usuarioId,
        carreraId,
        cicloId,
        activo: true,
      },
      select: { id: true },
    });

    if (!inscripcion) {
      throw new Error(
        'El estudiante no tiene una inscripción activa para esa carrera y ciclo.',
      );
    }

    // 3) Transacción en BD-Carrera (rollback automático si algo falla)
    return this.prisma.$transaction(async (tx) => {
      // 3.1 Verificar materia y cupos
      const materia = await tx.materia.findUnique({
        where: { id: materiaId },
        select: {
          id: true,
          nombre: true,
          activo: true,
          cuposDisponibles: true,
          inscripcionId: true,
          carreraId: true,
          cicloId: true,
        },
      });

      if (!materia || !materia.activo) {
        throw new Error('La materia no existe o está inactiva.');
      }

      // Validar que la materia pertenezca a la carrera/ciclo indicados
      if (materia.carreraId !== carreraId || materia.cicloId !== cicloId) {
        throw new Error('La materia no pertenece a la carrera/ciclo indicado.');
      }

      // Evitar doble matrícula: si ya tiene inscripción asignada
      if (materia.inscripcionId !== null && materia.inscripcionId !== undefined) {
        throw new Error('La materia ya está matriculada (ya tiene inscripción).');
      }

      // Verificar cupos
      if (materia.cuposDisponibles <= 0) {
        throw new Error('No hay cupos disponibles en la materia.');
      }

      // Registrar matrícula + descontar cupo
      const matricula = await tx.materia.update({
        where: { id: materiaId },
        data: {
          inscripcionId: inscripcion.id,
          cuposDisponibles: { decrement: 1 },
        },
        select: {
          id: true,
          nombre: true,
          inscripcionId: true,
          cuposDisponibles: true,
        },
      });

      return {
        ok: true,
        mensaje: 'Matrícula realizada correctamente.',
        materia: matricula,
      };
    });
  }
}

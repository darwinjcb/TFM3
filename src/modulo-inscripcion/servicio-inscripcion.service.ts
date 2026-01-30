// src/modulo-inscripcion/servicio-inscripcion.service.ts:

import { Injectable } from '@nestjs/common';
import { ServicioPrismaUsuario } from '../modulo-prisma/servicio-usuario/servicio-prisma-usuario.service';
import { CreateInscripcionDto } from './create-inscripcion.dto';
import { UpdateInscripcionDto } from './update-inscripcion.dto';

@Injectable()
export class ServicioInscripcionService {
  constructor(private readonly prisma: ServicioPrismaUsuario) {}

  // ============================
  // CRUD EXISTENTE
  // ============================

  // GET /inscripciones
  obtenerTodos() {
    return this.prisma.inscripcion.findMany({
      orderBy: { id: 'asc' },
      include: {
        usuario: true,
      },
    });
  }

  // GET /inscripciones/:id
  obtenerPorId(id: number) {
    return this.prisma.inscripcion.findUnique({
      where: { id },
      include: {
        usuario: true,
      },
    });
  }

  // POST /inscripciones
  async crear(data: CreateInscripcionDto) {
    return this.prisma.inscripcion.create({
      data: {
        usuarioId: data.usuarioId,
        carreraId: data.carreraId,
        cicloId: data.cicloId,
        // fechaInicio: data.fechaInicio ?? undefined,
      },
      include: {
        usuario: true,
      },
    });
  }

  // PATCH /inscripciones/:id
  async actualizar(id: number, data: UpdateInscripcionDto) {
    const updateData: Partial<{
      usuarioId: number;
      carreraId: number;
      cicloId: number;
      fechaInicio: Date;
      activo: boolean;
    }> = {};

    if (data.usuarioId !== undefined) updateData.usuarioId = data.usuarioId;
    if (data.carreraId !== undefined) updateData.carreraId = data.carreraId;
    if (data.cicloId !== undefined) updateData.cicloId = data.cicloId;
    if (data.fechaInicio !== undefined) updateData.fechaInicio = data.fechaInicio;

    // (opcional) si tu UpdateInscripcionDto tiene "activo"
    // if ((data as any).activo !== undefined) updateData.activo = (data as any).activo;

    return this.prisma.inscripcion.update({
      where: { id },
      data: updateData,
      include: {
        usuario: true,
      },
    });
  }

  // DELETE físico /inscripciones/:id
  async eliminar(id: number) {
    return this.prisma.inscripcion.delete({
      where: { id },
    });
  }

  // ============================
  // PARTE 1 – CONSULTA DERIVADA (PUNTO 4)
  // ============================
  // "Mostrar las matrículas de un estudiante en un ciclo determinado"
  async obtenerMatriculasPorCiclo(usuarioId: number, cicloId: number) {
    return this.prisma.inscripcion.findMany({
      where: {
        usuarioId,
        cicloId,
        activo: true,
      },
      orderBy: { id: 'asc' },
      include: {
        usuario: true,
      },
    });
  }
}

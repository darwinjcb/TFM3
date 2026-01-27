// src/modulo-materia/servicio-materia.service.ts

import { Injectable } from '@nestjs/common';
import { ServicioPrismaCarrera } from '../modulo-prisma/servicio-carrera/servicio-prisma-carrera.service';
import { CreateMateriaDto } from './create-materia.dto';
import { UpdateMateriaDto } from './update-materia.dto';

@Injectable()
export class ServicioMateriaService {
  constructor(private readonly prisma: ServicioPrismaCarrera) {}

  // GET /materias
  obtenerTodos() {
    return this.prisma.materia.findMany({
      include: {
        carrera: true,
        ciclo: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  // GET /materias/:id
  obtenerPorId(id: number) {
    return this.prisma.materia.findUnique({
      where: { id },
      include: {
        carrera: true,
        ciclo: true,
      },
    });
  }

  // POST /materias
  async crear(data: CreateMateriaDto) {
    return this.prisma.materia.create({
      data: {
        nombre: data.nombre,
        codigo: data.codigo,
        creditos: data.creditos ?? 3,
        carreraId: data.carreraId,
        cicloId: data.cicloId,
        inscripcionId: data.inscripcionId ?? null,
      },
      include: {
        carrera: true,
        ciclo: true,
      },
    });
  }

  // PATCH /materias/:id
  async actualizar(id: number, data: UpdateMateriaDto) {
    const updateData: Partial<{
      nombre: string;
      codigo: string;
      creditos: number;
      carreraId: number;
      cicloId: number;
      inscripcionId: number | null;
    }> = {};

    if (data.nombre !== undefined) updateData.nombre = data.nombre;
    if (data.codigo !== undefined) updateData.codigo = data.codigo;
    if (data.creditos !== undefined) updateData.creditos = data.creditos;
    if (data.carreraId !== undefined) updateData.carreraId = data.carreraId;
    if (data.cicloId !== undefined) updateData.cicloId = data.cicloId;
    if (data.inscripcionId !== undefined) {
      updateData.inscripcionId = data.inscripcionId;
    }

    return this.prisma.materia.update({
      where: { id },
      data: updateData,
      include: {
        carrera: true,
        ciclo: true,
      },
    });
  }

  // DELETE físico /materias/:id
  async eliminar(id: number) {
    return this.prisma.materia.delete({
      where: { id },
    });
  }
}

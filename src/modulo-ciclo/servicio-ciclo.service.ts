// src/modulo-ciclo/servicio-ciclo.service.ts

import { Injectable } from '@nestjs/common';
import { ServicioPrismaCarrera } from '../modulo-prisma/servicio-carrera/servicio-prisma-carrera.service';
import { CreateCicloDto } from './create-ciclo.dto';
import { UpdateCicloDto } from './update-ciclo.dto';

@Injectable()
export class ServicioCicloService {
  constructor(private readonly prisma: ServicioPrismaCarrera) { }

  // GET /ciclos
  obtenerTodos() {
    return this.prisma.ciclo.findMany({
      include: {
        carrera: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  // GET /ciclos/:id
  obtenerPorId(id: number) {
    return this.prisma.ciclo.findUnique({
      where: { id },
      include: {
        carrera: true,
      },
    });
  }

  // POST /ciclos
  crear(data: CreateCicloDto) {
    return this.prisma.ciclo.create({
      data: {
        numero: data.numero,
        nombre: data.nombre,
        carreraId: data.carreraId,
      },
      include: {
        carrera: true,
      },
    });
  }

  // PATCH /ciclos/:id
  actualizar(id: number, data: UpdateCicloDto) {
    const updateData: Partial<{
      numero: number;
      nombre: string | null;
      carreraId: number;
    }> = {};

    if (data.numero !== undefined) {
      updateData.numero = data.numero;
    }

    if (data.nombre !== undefined) {
      updateData.nombre = data.nombre;
    }

    if (data.carreraId !== undefined) {
      updateData.carreraId = data.carreraId;
    }

    return this.prisma.ciclo.update({
      where: { id },
      data: updateData,
      include: {
        carrera: true,
      },
    });
  }

  // DELETE físico /ciclos/:id
  async eliminar(id: number) {
    // Primero eliminamos las materias asociadas a este ciclo
    await this.prisma.materia.deleteMany({
      where: { cicloId: id },
    });

    // Luego eliminamos el ciclo
    return this.prisma.ciclo.delete({
      where: { id },
    });
  }
}

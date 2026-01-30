// src/modulo-carrera/servicio-carrera.service.ts

import { Injectable } from '@nestjs/common';
import { ServicioPrismaCarrera } from '../modulo-prisma/servicio-carrera/servicio-prisma-carrera.service';
import { CreateCarreraDto } from './create-carrera.dto';
import { UpdateCarreraDto } from './update-carrera.dto';

@Injectable()
export class ServicioCarreraService {
  constructor(private readonly prisma: ServicioPrismaCarrera) { }

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

  // ✅ GET /carreras/:id/materias
  // Parte 1 (Consulta derivada): "Obtener las materias asociadas a una carrera específica"
  obtenerMateriasPorCarrera(id: number) {
    return this.prisma.materia.findMany({
      where: {
        carreraId: id,
        // si quieres incluir también inactivas, quita esta línea:
        activo: true,
      },
      include: {
        ciclo: true,
        carrera: {
          select: {
            id: true,
            nombre: true,
          },
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

  // DELETE /carreras/:id — BORRADO FÍSICO REAL
  async eliminar(id: number) {
    // Eliminamos primero las materias y ciclos dependientes
    await this.prisma.materia.deleteMany({ where: { carreraId: id } });
    await this.prisma.ciclo.deleteMany({ where: { carreraId: id } });

    // Luego eliminamos la carrera
    return this.prisma.carrera.delete({
      where: { id },
    });
  }
}

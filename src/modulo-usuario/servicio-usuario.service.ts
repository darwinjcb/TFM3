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
        rol: { nombre: 'ESTUDIANTE' }, // ✅ como pidió tu docente
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
      ...new Set(
        estudiantes.flatMap((e) => e.inscripciones.map((i) => i.carreraId)),
      ),
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
  // PARTE 2 – OPERADORES LÓGICOS
  // ============================
  // AND:
  // Buscar estudiantes que estén:
  // - activos
  // - con rol ESTUDIANTE
  // - pertenecen a una carrera específica
  // - y estén matriculados en un ciclo específico (tu “período académico”)
  async buscarEstudiantesActivosPorCarreraYCiclo(
    carreraId: number,
    cicloId: number,
  ) {
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

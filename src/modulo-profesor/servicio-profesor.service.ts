// src/modulo-profesor/servicio-profesor.service.ts

import { Injectable } from '@nestjs/common';
import { ServicioPrismaProfesor } from '../modulo-prisma/servicio-profesor/servicio-prisma-profesor.service';
import { ServicioPrismaCarrera } from '../modulo-prisma/servicio-carrera/servicio-prisma-carrera.service';
import { CreateProfesorDto } from './create-profesor.dto';
import { UpdateProfesorDto } from './update-profesor.dto';

@Injectable()
export class ServicioProfesor {
    constructor(
        private readonly prismaProfesor: ServicioPrismaProfesor,
        private readonly prismaCarrera: ServicioPrismaCarrera,
    ) { }

    // ============================
    // CRUD EXISTENTE
    // ============================

    // GET /profesores
    obtenerTodos() {
        return this.prismaProfesor.profesor.findMany({
            orderBy: { id: 'asc' },
        });
    }

    // GET /profesores/:id
    obtenerPorId(id: number) {
        return this.prismaProfesor.profesor.findUnique({
            where: { id },
        });
    }

    // POST /profesores
    crear(data: CreateProfesorDto) {
        return this.prismaProfesor.profesor.create({
            data: {
                nombres: data.nombres,
                apellidos: data.apellidos,
                email: data.email,
                telefono: data.telefono ?? null,
            },
        });
    }

    // PATCH /profesores/:id
    async actualizar(id: number, data: UpdateProfesorDto) {
        const updateData: Partial<{
            nombres: string;
            apellidos: string;
            email: string;
            telefono: string | null;
        }> = {};

        if (data.nombres !== undefined) updateData.nombres = data.nombres;
        if (data.apellidos !== undefined) updateData.apellidos = data.apellidos;
        if (data.email !== undefined) updateData.email = data.email;
        if (data.telefono !== undefined) updateData.telefono = data.telefono;

        return this.prismaProfesor.profesor.update({
            where: { id },
            data: updateData,
        });
    }

    // DELETE /profesores/:id
    async eliminar(id: number) {
        await this.prismaProfesor.titulo.deleteMany({
            where: { profesorId: id },
        });

        return this.prismaProfesor.profesor.delete({
            where: { id },
        });
    }

    // ============================
    // PARTE 1 – CONSULTA DERIVADA
    // ============================
    // "Listar los docentes que imparten más de una asignatura"
    async listarDocentesConMasDeUnaAsignatura() {
        // 1. Obtener materias activas con profesor asignado (BD Carrera)
        const materias = await this.prismaCarrera.materia.findMany({
            where: {
                activo: true,
                profesorId: { not: null },
            },
            select: {
                profesorId: true,
            },
        });

        // 2. Contar materias por profesor
        const conteo = new Map<number, number>();
        for (const m of materias) {
            const id = m.profesorId!;
            conteo.set(id, (conteo.get(id) ?? 0) + 1);
        }

        // 3. Profesores con más de una materia
        const profesoresIds = [...conteo.entries()]
            .filter(([, total]) => total > 1)
            .map(([id]) => id);

        if (profesoresIds.length === 0) return [];

        // 4. Obtener profesores desde BD Profesor
        const profesores = await this.prismaProfesor.profesor.findMany({
            where: { id: { in: profesoresIds } },
            orderBy: { id: 'asc' },
        });

        // 5. Respuesta final
        return profesores.map((p) => ({
            ...p,
            totalMaterias: conteo.get(p.id) ?? 0,
        }));
    }
}

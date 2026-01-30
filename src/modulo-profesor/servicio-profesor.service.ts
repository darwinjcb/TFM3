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

    obtenerTodos() {
        return this.prismaProfesor.profesor.findMany({
            orderBy: { id: 'asc' },
        });
    }

    obtenerPorId(id: number) {
        return this.prismaProfesor.profesor.findUnique({
            where: { id },
        });
    }

    crear(data: CreateProfesorDto) {
        return this.prismaProfesor.profesor.create({
            data: {
                nombres: data.nombres,
                apellidos: data.apellidos,
                email: data.email,
                telefono: data.telefono ?? null,
                // tiempoCompleto se setea por defecto si lo agregaste en el schema
            },
        });
    }

    async actualizar(id: number, data: UpdateProfesorDto) {
        const updateData: Partial<{
            nombres: string;
            apellidos: string;
            email: string;
            telefono: string | null;
            tiempoCompleto: boolean;
            activo: boolean;
        }> = {};

        if (data.nombres !== undefined) updateData.nombres = data.nombres;
        if (data.apellidos !== undefined) updateData.apellidos = data.apellidos;
        if (data.email !== undefined) updateData.email = data.email;
        if (data.telefono !== undefined) updateData.telefono = data.telefono;

        // Si tu UpdateProfesorDto ya tiene estos campos, se aplican.
        // Si no los tiene, no pasa nada (solo no se actualizan).
        if ((data as any).tiempoCompleto !== undefined) {
            updateData.tiempoCompleto = (data as any).tiempoCompleto;
        }
        if ((data as any).activo !== undefined) {
            updateData.activo = (data as any).activo;
        }

        return this.prismaProfesor.profesor.update({
            where: { id },
            data: updateData,
        });
    }

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
        const materias = await this.prismaCarrera.materia.findMany({
            where: {
                activo: true,
                profesorId: { not: null },
            },
            select: {
                profesorId: true,
            },
        });

        const conteo = new Map<number, number>();
        for (const m of materias) {
            const id = m.profesorId!;
            conteo.set(id, (conteo.get(id) ?? 0) + 1);
        }

        const profesoresIds = [...conteo.entries()]
            .filter(([, total]) => total > 1)
            .map(([id]) => id);

        if (profesoresIds.length === 0) return [];

        const profesores = await this.prismaProfesor.profesor.findMany({
            where: { id: { in: profesoresIds } },
            orderBy: { id: 'asc' },
        });

        return profesores.map((p) => ({
            ...p,
            totalMaterias: conteo.get(p.id) ?? 0,
        }));
    }

    // ============================
    // PARTE 2 – OPERADORES LÓGICOS (AND / OR / NOT)
    // ============================
    // Filtrar docentes que:
    // - sean de tiempo completo AND
    // - dicten asignaturas OR (o tengan títulos, para evidenciar OR con datos reales)
    // - NO estén inactivos (NOT)
    async filtrarDocentesTiempoCompleto_AND_OR_NOT() {
        // Docentes que dictan asignaturas (aparecen en Materia.profesorId)
        const materias = await this.prismaCarrera.materia.findMany({
            where: {
                activo: true,
                profesorId: { not: null },
            },
            select: { profesorId: true },
        });

        const profesoresConMaterias = [
            ...new Set(materias.map((m) => m.profesorId!).filter(Boolean)),
        ];

        return this.prismaProfesor.profesor.findMany({
            where: {
                AND: [
                    { tiempoCompleto: true },     // ✅ AND
                    { NOT: { activo: false } },   // ✅ NOT (no inactivos)
                    {
                        OR: [                       // ✅ OR
                            { id: { in: profesoresConMaterias } }, // dictan asignaturas
                            { titulos: { some: {} } },             // o tienen títulos
                        ],
                    },
                ],
            },
            include: {
                titulos: true,
            },
            orderBy: { id: 'asc' },
        });
    }
}

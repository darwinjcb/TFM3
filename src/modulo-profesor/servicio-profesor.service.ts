// src/modulo-profesor/servicio-profesor.service.ts

import { Injectable } from '@nestjs/common';
import { ServicioPrismaProfesor } from '../modulo-prisma/servicio-profesor/servicio-prisma-profesor.service';
import { CreateProfesorDto } from './create-profesor.dto';
import { UpdateProfesorDto } from './update-profesor.dto';

@Injectable()
export class ServicioProfesor {
    constructor(private readonly prisma: ServicioPrismaProfesor) { }

    // GET /profesores
    obtenerTodos() {
        return this.prisma.profesor.findMany({
            orderBy: { id: 'asc' },
        });
    }

    // GET /profesores/:id
    obtenerPorId(id: number) {
        return this.prisma.profesor.findUnique({
            where: { id },
        });
    }

    // POST /profesores
    crear(data: CreateProfesorDto) {
        return this.prisma.profesor.create({
            data: {
                nombres: data.nombres,
                apellidos: data.apellidos,
                email: data.email,
                telefono: data.telefono ?? null,
                // activo, creadoEn, actualizadoEn se llenan solos por Prisma
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

        return this.prisma.profesor.update({
            where: { id },
            data: updateData,
        });
    }

    // DELETE físico /profesores/:id
    async eliminar(id: number) {
        // Primero borramos los títulos asociados (borrado físico también)
        await this.prisma.titulo.deleteMany({
            where: { profesorId: id },
        });

        // Luego borramos al profesor
        return this.prisma.profesor.delete({
            where: { id },
        });
    }
}

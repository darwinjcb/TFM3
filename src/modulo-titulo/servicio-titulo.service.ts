// src/modulo-titulo/servicio-titulo.service.ts

import { Injectable } from '@nestjs/common';
import { ServicioPrismaProfesor } from '../modulo-prisma/servicio-profesor/servicio-prisma-profesor.service';
import { CreateTituloDto } from './create-titulo.dto';
import { UpdateTituloDto } from './update-titulo.dto';

@Injectable()
export class ServicioTitulo {
    constructor(private readonly prisma: ServicioPrismaProfesor) { }

    // GET /titulos
    obtenerTodos() {
        return this.prisma.titulo.findMany({
            orderBy: { id: 'asc' },
            include: {
                profesor: {
                    select: {
                        id: true,
                        nombres: true,
                        apellidos: true,
                        email: true,
                    },
                },
            },
        });
    }

    // GET /titulos/:id
    obtenerPorId(id: number) {
        return this.prisma.titulo.findUnique({
            where: { id },
            include: {
                profesor: {
                    select: {
                        id: true,
                        nombres: true,
                        apellidos: true,
                        email: true,
                    },
                },
            },
        });
    }

    // POST /titulos
    crear(data: CreateTituloDto) {
        return this.prisma.titulo.create({
            data: {
                nombre: data.nombre,
                institucion: data.institucion ?? null,
                anioObtencion: data.anioObtencion ?? null,
                profesor: {
                    connect: { id: data.profesorId },
                },
            },
            include: {
                profesor: {
                    select: {
                        id: true,
                        nombres: true,
                        apellidos: true,
                        email: true,
                    },
                },
            },
        });
    }

    // PATCH /titulos/:id
    async actualizar(id: number, data: UpdateTituloDto) {
        const updateData: Partial<{
            nombre: string;
            institucion: string | null;
            anioObtencion: number | null;
            profesor: { connect: { id: number } };
        }> = {};

        if (data.nombre !== undefined) {
            updateData.nombre = data.nombre;
        }

        if (data.institucion !== undefined) {
            updateData.institucion = data.institucion;
        }

        if (data.anioObtencion !== undefined) {
            updateData.anioObtencion = data.anioObtencion;
        }

        if (data.profesorId !== undefined) {
            updateData.profesor = { connect: { id: data.profesorId } };
        }

        return this.prisma.titulo.update({
            where: { id },
            data: updateData,
            include: {
                profesor: {
                    select: {
                        id: true,
                        nombres: true,
                        apellidos: true,
                        email: true,
                    },
                },
            },
        });
    }

    // DELETE físico /titulos/:id
    eliminar(id: number) {
        return this.prisma.titulo.delete({
            where: { id },
        });
    }
}

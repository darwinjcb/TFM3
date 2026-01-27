// src/modulo-rol/servicio-rol.service.ts

import { Injectable } from '@nestjs/common';
import { ServicioPrismaUsuario } from '../modulo-prisma/servicio-usuario/servicio-prisma-usuario.service';
import { CreateRolDto } from './create-rol.dto';
import { UpdateRolDto } from './update-rol.dto';

@Injectable()
export class ServicioRol {
    constructor(private readonly prisma: ServicioPrismaUsuario) { }

    // GET /roles
    obtenerTodos() {
        return this.prisma.rol.findMany({
            orderBy: { id: 'asc' },
        });
    }

    // GET /roles/:id
    obtenerPorId(id: number) {
        return this.prisma.rol.findUnique({
            where: { id },
        });
    }

    // POST /roles
    crear(data: CreateRolDto) {
        return this.prisma.rol.create({
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion ?? null,
                esSistema: data.esSistema ?? false,
            },
        });
    }

    // PATCH /roles/:id
    async actualizar(id: number, data: UpdateRolDto) {
        const updateData: any = {};

        if (data.nombre !== undefined) updateData.nombre = data.nombre;
        if (data.descripcion !== undefined) updateData.descripcion = data.descripcion;
        if (data.esSistema !== undefined) updateData.esSistema = data.esSistema;

        return this.prisma.rol.update({
            where: { id },
            data: updateData,
        });
    }

    // DELETE /roles/:id (borrado físico)
    async eliminar(id: number) {
        return this.prisma.rol.delete({
            where: { id },
        });
    }
}

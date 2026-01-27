import { Injectable } from '@nestjs/common';
import { ServicioPrismaUsuario } from '../modulo-prisma/servicio-usuario/servicio-prisma-usuario.service';
import { CreatePermisoDto } from './create-permiso.dto';
import { UpdatePermisoDto } from './update-permiso.dto';

@Injectable()
export class ServicioPermisoService {
    constructor(private readonly prisma: ServicioPrismaUsuario) { }

    // GET /permisos
    obtenerTodos() {
        return this.prisma.permiso.findMany({
            orderBy: { id: 'asc' },
        });
    }

    // GET /permisos/:id
    obtenerPorId(id: number) {
        return this.prisma.permiso.findUnique({
            where: { id },
        });
    }

    // POST /permisos
    crear(data: CreatePermisoDto) {
        return this.prisma.permiso.create({
            data: {
                codigo: data.codigo,
                descripcion: data.descripcion ?? null,
                categoria: data.categoria ?? null,
            },
        });
    }

    // PATCH /permisos/:id
    async actualizar(id: number, data: UpdatePermisoDto) {
        const updateData: Partial<{
            codigo: string;
            descripcion: string | null;
            categoria: string | null;
        }> = {};

        if (data.codigo !== undefined) updateData.codigo = data.codigo;
        if (data.descripcion !== undefined) updateData.descripcion = data.descripcion;
        if (data.categoria !== undefined) updateData.categoria = data.categoria;

        return this.prisma.permiso.update({
            where: { id },
            data: updateData,
        });
    }

    // DELETE físico /permisos/:id
    async eliminar(id: number) {
        return this.prisma.permiso.delete({
            where: { id },
        });
    }
}

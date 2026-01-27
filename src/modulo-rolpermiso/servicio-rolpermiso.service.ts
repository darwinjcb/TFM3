import { Injectable } from '@nestjs/common';
import { ServicioPrismaUsuario } from '../modulo-prisma/servicio-usuario/servicio-prisma-usuario.service';
import { CreateRolPermisoDto } from './create-rolpermiso.dto';
import { UpdateRolPermisoDto } from './update-rolpermiso.dto';

@Injectable()
export class ServicioRolPermisoService {
    constructor(private readonly prisma: ServicioPrismaUsuario) { }

    // GET /rolpermisos
    obtenerTodos() {
        return this.prisma.rolPermiso.findMany({
            include: {
                rol: true,
                permiso: true,
            },
            orderBy: { id: 'asc' },
        });
    }

    // GET /rolpermisos/:id
    obtenerPorId(id: number) {
        return this.prisma.rolPermiso.findUnique({
            where: { id },
            include: {
                rol: true,
                permiso: true,
            },
        });
    }

    // POST /rolpermisos
    crear(data: CreateRolPermisoDto) {
        return this.prisma.rolPermiso.create({
            data: {
                rol: { connect: { id: data.rolId } },
                permiso: { connect: { id: data.permisoId } },
            },
            include: {
                rol: true,
                permiso: true,
            },
        });
    }

    // PATCH /rolpermisos/:id
    async actualizar(id: number, data: UpdateRolPermisoDto) {
        const updateData: any = {};

        if (data.rolId !== undefined) updateData.rol = { connect: { id: data.rolId } };
        if (data.permisoId !== undefined) updateData.permiso = { connect: { id: data.permisoId } };

        return this.prisma.rolPermiso.update({
            where: { id },
            data: updateData,
            include: {
                rol: true,
                permiso: true,
            },
        });
    }

    // DELETE /rolpermisos/:id (BORRADO FISICO)
    eliminar(id: number) {
        return this.prisma.rolPermiso.delete({
            where: { id },
        });
    }
}

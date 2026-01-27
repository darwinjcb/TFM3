import { Injectable } from '@nestjs/common';
import { ServicioPrismaUsuario } from '../modulo-prisma/servicio-usuario/servicio-prisma-usuario.service';
import { CreateInscripcionDto } from './create-inscripcion.dto';
import { UpdateInscripcionDto } from './update-inscripcion.dto';

@Injectable()
export class ServicioInscripcionService {
    constructor(private readonly prisma: ServicioPrismaUsuario) { }

    // GET /inscripciones
    obtenerTodos() {
        return this.prisma.inscripcion.findMany({
            orderBy: { id: 'asc' },
            include: {
                usuario: true, // trae datos del Usuario
            },
        });
    }

    // GET /inscripciones/:id
    obtenerPorId(id: number) {
        return this.prisma.inscripcion.findUnique({
            where: { id },
            include: {
                usuario: true,
            },
        });
    }

    // POST /inscripciones
    async crear(data: CreateInscripcionDto) {
        return this.prisma.inscripcion.create({
            data: {
                usuarioId: data.usuarioId,
                carreraId: data.carreraId,
                cicloId: data.cicloId,
                // fechaInicio: data.fechaInicio ?? undefined,  // si quieres permitir setearla
            },
            include: {
                usuario: true,
            },
        });
    }

    // PATCH /inscripciones/:id
    async actualizar(id: number, data: UpdateInscripcionDto) {
        const updateData: Partial<{
            usuarioId: number;
            carreraId: number;
            cicloId: number;
            fechaInicio: Date;
        }> = {};

        if (data.usuarioId !== undefined) {
            updateData.usuarioId = data.usuarioId;
        }

        if (data.carreraId !== undefined) {
            updateData.carreraId = data.carreraId;
        }

        if (data.cicloId !== undefined) {
            updateData.cicloId = data.cicloId;
        }

        if (data.fechaInicio !== undefined) {
            updateData.fechaInicio = data.fechaInicio;
        }

        return this.prisma.inscripcion.update({
            where: { id },
            data: updateData,
            include: {
                usuario: true,
            },
        });
    }

    // DELETE físico /inscripciones/:id
    async eliminar(id: number) {
        return this.prisma.inscripcion.delete({
            where: { id },
        });
    }
}

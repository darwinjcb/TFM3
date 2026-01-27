// src/modulo-usuario/servicio-usuario.service.ts

import { Injectable } from '@nestjs/common';
import { ServicioPrismaUsuario } from '../modulo-prisma/servicio-usuario/servicio-prisma-usuario.service';
import { CreateUsuarioDto } from './create-usuario.dto';
import { UpdateUsuarioDto } from './update-usuario.dto';

@Injectable()
export class ServicioUsuario {
  constructor(private readonly prisma: ServicioPrismaUsuario) { }

  // GET /usuarios
  obtenerTodos() {
    return this.prisma.usuario.findMany();
  }

  // GET /usuarios/:id
  obtenerPorId(id: number) {
    return this.prisma.usuario.findUnique({
      where: { id },
    });
  }

  // POST /usuarios
  async crear(data: CreateUsuarioDto) {
    return this.prisma.usuario.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        passwordHash: data.password, // luego lo cambiamos a hash
        rolId: data.rolId,
        profesorId: data.profesorId ?? null,
      },
    });
  }

  // PATCH /usuarios/:id
  async actualizar(id: number, data: UpdateUsuarioDto) {
    // armamos el objeto data sin campos undefined
    const updateData: Partial<{
      nombre: string;
      email: string;
      passwordHash: string;
      rolId: number;
      profesorId: number | null;
    }> = {};

    if (data.nombre !== undefined) {
      updateData.nombre = data.nombre;
    }

    if (data.email !== undefined) {
      updateData.email = data.email;
    }

    if (data.password !== undefined) {
      // por ahora igual que crear, luego lo hacheamos
      updateData.passwordHash = data.password;
    }

    if (data.rolId !== undefined) {
      updateData.rolId = data.rolId;
    }

    if (data.profesorId !== undefined) {
      updateData.profesorId = data.profesorId;
    }

    return this.prisma.usuario.update({
      where: { id },
      data: updateData,
    });
  }

  // DELETE físico /usuarios/:id
  async eliminar(id: number) {
    return this.prisma.usuario.delete({
      where: { id },
    });
  }
}

// src/modulo-usuario/controlador-usuario.controller.ts

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ServicioUsuario } from './servicio-usuario.service';
import { CreateUsuarioDto } from './create-usuario.dto';
import { UpdateUsuarioDto } from './update-usuario.dto';

@Controller('usuarios')
export class ControladorUsuarioController {
  constructor(
    private readonly servicioUsuario: ServicioUsuario,
  ) { }

  // ============================
  // CONSULTA DERIVADA – PARTE 1
  // ============================
  // GET /usuarios/estudiantes/activos/carrera
  @Get('estudiantes/activos/carrera')
  listarEstudiantesActivosConCarrera() {
    return this.servicioUsuario.listarEstudiantesActivosConCarrera();
  }

  // ============================
  // CRUD EXISTENTE
  // ============================

  // GET /usuarios
  @Get()
  obtenerTodos() {
    return this.servicioUsuario.obtenerTodos();
  }

  // GET /usuarios/:id
  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.servicioUsuario.obtenerPorId(Number(id));
  }

  // POST /usuarios
  @Post()
  crear(@Body() data: CreateUsuarioDto) {
    return this.servicioUsuario.crear(data);
  }

  // PATCH /usuarios/:id
  @Patch(':id')
  actualizar(
    @Param('id') id: string,
    @Body() data: UpdateUsuarioDto,
  ) {
    return this.servicioUsuario.actualizar(Number(id), data);
  }

  // DELETE /usuarios/:id
  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.servicioUsuario.eliminar(Number(id));
  }
}

// src/modulo-carrera/controlador-carrera.controller.ts:

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ServicioCarreraService } from './servicio-carrera.service';
import { CreateCarreraDto } from './create-carrera.dto';
import { UpdateCarreraDto } from './update-carrera.dto';

@Controller('carreras')
export class ControladorCarreraController {
  constructor(
    private readonly servicioCarrera: ServicioCarreraService,
  ) { }

  // GET /carreras
  @Get()
  obtenerTodos() {
    return this.servicioCarrera.obtenerTodos();
  }

  // GET /carreras/:id
  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.servicioCarrera.obtenerPorId(Number(id));
  }

  // ✅ GET /carreras/:id/materias
  // Parte 1 – Consulta derivada:
  // "Obtener las materias asociadas a una carrera específica"
  @Get(':id/materias')
  obtenerMateriasPorCarrera(@Param('id') id: string) {
    return this.servicioCarrera.obtenerMateriasPorCarrera(Number(id));
  }

  // POST /carreras
  @Post()
  crear(@Body() data: CreateCarreraDto) {
    return this.servicioCarrera.crear(data);
  }

  // PATCH /carreras/:id
  @Patch(':id')
  actualizar(
    @Param('id') id: string,
    @Body() data: UpdateCarreraDto,
  ) {
    return this.servicioCarrera.actualizar(Number(id), data);
  }
}

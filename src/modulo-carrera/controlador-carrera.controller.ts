// src/modulo-carrera/controlador-carrera.controller.ts:
import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
} from '@nestjs/common';
import { ServicioCarreraService } from './servicio-carrera.service';
import { CreateCarreraDto } from './create-carrera.dto';
import { UpdateCarreraDto } from './update-carrera.dto';

@Controller('carreras')
export class ControladorCarreraController {
  constructor(private readonly servicioCarrera: ServicioCarreraService) { }

  @Get()
  obtenerTodos() {
    return this.servicioCarrera.obtenerTodos();
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.servicioCarrera.obtenerPorId(Number(id));
  }

  @Get(':id/materias')
  obtenerMateriasPorCarrera(@Param('id') id: string) {
    return this.servicioCarrera.obtenerMateriasPorCarrera(Number(id));
  }

  @Post()
  crear(@Body() data: CreateCarreraDto) {
    return this.servicioCarrera.crear(data);
  }

  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() data: UpdateCarreraDto) {
    return this.servicioCarrera.actualizar(Number(id), data);
  }

  // PARTE 4: TRANSACCIÓN
  // POST /carreras/matricular
  @Post('matricular')
  matricular(@Body() body: { usuarioId: number; materiaId: number; carreraId: number; cicloId: number }) {
    return this.servicioCarrera.matricularEnMateria(body);
  }
}

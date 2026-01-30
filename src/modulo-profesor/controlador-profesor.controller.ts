// src/modulo-profesor/controlador-profesor.controller.ts:

import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
} from '@nestjs/common';
import { ServicioProfesor } from './servicio-profesor.service';
import { CreateProfesorDto } from './create-profesor.dto';
import { UpdateProfesorDto } from './update-profesor.dto';

@Controller('profesores')
export class ControladorProfesor {
    constructor(
        private readonly servicioProfesor: ServicioProfesor,
    ) { }

    // ============================
    // CONSULTA DERIVADA – PARTE 1
    // ============================
    // GET /profesores/mas-de-una-asignatura
    @Get('mas-de-una-asignatura')
    listarDocentesConMasDeUnaAsignatura() {
        return this.servicioProfesor.listarDocentesConMasDeUnaAsignatura();
    }

    // ============================
    // CRUD EXISTENTE
    // ============================

    // GET /profesores
    @Get()
    obtenerTodos() {
        return this.servicioProfesor.obtenerTodos();
    }

    // GET /profesores/:id
    @Get(':id')
    obtenerPorId(@Param('id') id: string) {
        return this.servicioProfesor.obtenerPorId(Number(id));
    }

    // POST /profesores
    @Post()
    crear(@Body() data: CreateProfesorDto) {
        return this.servicioProfesor.crear(data);
    }

    // PATCH /profesores/:id
    @Patch(':id')
    actualizar(
        @Param('id') id: string,
        @Body() data: UpdateProfesorDto,
    ) {
        return this.servicioProfesor.actualizar(Number(id), data);
    }

    // DELETE /profesores/:id
    @Delete(':id')
    eliminar(@Param('id') id: string) {
        return this.servicioProfesor.eliminar(Number(id));
    }
}

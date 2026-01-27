// src/modulo-profesor/controlador-profesor.controller.ts
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { ServicioProfesor } from './servicio-profesor.service';
import { CreateProfesorDto } from './create-profesor.dto';
import { UpdateProfesorDto } from './update-profesor.dto';

@Controller('profesores')
export class ControladorProfesor {
    constructor(private readonly servicioProfesor: ServicioProfesor) { }

    @Get()
    obtenerTodos() {
        return this.servicioProfesor.obtenerTodos();
    }

    @Get(':id')
    obtenerPorId(@Param('id', ParseIntPipe) id: number) {
        return this.servicioProfesor.obtenerPorId(id);
    }

    @Post()
    crear(@Body() body: CreateProfesorDto) {
        return this.servicioProfesor.crear(body);
    }

    @Patch(':id')
    actualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateProfesorDto,
    ) {
        return this.servicioProfesor.actualizar(id, body);
    }

    @Delete(':id')
    eliminar(@Param('id', ParseIntPipe) id: number) {
        return this.servicioProfesor.eliminar(id);
    }
}

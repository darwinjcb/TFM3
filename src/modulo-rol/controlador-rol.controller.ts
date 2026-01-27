// src/modulo-rol/controlador-rol.controller.ts

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
import { ServicioRol } from './servicio-rol.service';
import { CreateRolDto } from './create-rol.dto';
import { UpdateRolDto } from './update-rol.dto';

@Controller('roles')
export class ControladorRol {
    constructor(private readonly servicioRol: ServicioRol) { }

    @Get()
    obtenerTodos() {
        return this.servicioRol.obtenerTodos();
    }

    @Get(':id')
    obtenerPorId(@Param('id', ParseIntPipe) id: number) {
        return this.servicioRol.obtenerPorId(id);
    }

    @Post()
    crear(@Body() data: CreateRolDto) {
        return this.servicioRol.crear(data);
    }

    @Patch(':id')
    actualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: UpdateRolDto,
    ) {
        return this.servicioRol.actualizar(id, data);
    }

    @Delete(':id')
    eliminar(@Param('id', ParseIntPipe) id: number) {
        return this.servicioRol.eliminar(id);
    }
}

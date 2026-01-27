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
import { ServicioTitulo } from './servicio-titulo.service';
import { CreateTituloDto } from './create-titulo.dto';
import { UpdateTituloDto } from './update-titulo.dto';

@Controller('titulos')
export class ControladorTitulo {
    constructor(private readonly servicioTitulo: ServicioTitulo) { }

    @Get()
    obtenerTodos() {
        return this.servicioTitulo.obtenerTodos();
    }

    @Get(':id')
    obtenerPorId(@Param('id', ParseIntPipe) id: number) {
        return this.servicioTitulo.obtenerPorId(id);
    }

    @Post()
    crear(@Body() body: CreateTituloDto) {
        return this.servicioTitulo.crear(body);
    }

    @Patch(':id')
    actualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateTituloDto,
    ) {
        return this.servicioTitulo.actualizar(id, body);
    }

    @Delete(':id')
    eliminar(@Param('id', ParseIntPipe) id: number) {
        return this.servicioTitulo.eliminar(id);
    }
}

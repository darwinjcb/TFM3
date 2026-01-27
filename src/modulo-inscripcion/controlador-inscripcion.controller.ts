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
import { ServicioInscripcionService } from './servicio-inscripcion.service';
import { CreateInscripcionDto } from './create-inscripcion.dto';
import { UpdateInscripcionDto } from './update-inscripcion.dto';

@Controller('inscripciones')
export class ControladorInscripcionController {
    constructor(private readonly servicio: ServicioInscripcionService) { }

    // POST /inscripciones
    @Post()
    crear(@Body() data: CreateInscripcionDto) {
        return this.servicio.crear(data);
    }

    // GET /inscripciones
    @Get()
    obtenerTodos() {
        return this.servicio.obtenerTodos();
    }

    // GET /inscripciones/:id
    @Get(':id')
    obtenerPorId(@Param('id', ParseIntPipe) id: number) {
        return this.servicio.obtenerPorId(id);
    }

    // PATCH /inscripciones/:id
    @Patch(':id')
    actualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: UpdateInscripcionDto,
    ) {
        return this.servicio.actualizar(id, data);
    }

    // DELETE /inscripciones/:id
    @Delete(':id')
    eliminar(@Param('id', ParseIntPipe) id: number) {
        return this.servicio.eliminar(id);
    }
}

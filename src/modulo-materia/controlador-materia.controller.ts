import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    ParseIntPipe,
} from '@nestjs/common';
import { ServicioMateriaService } from './servicio-materia.service';
import { CreateMateriaDto } from './create-materia.dto';
import { UpdateMateriaDto } from './update-materia.dto';

@Controller('materias')
export class ControladorMateriaController {
    constructor(private readonly servicio: ServicioMateriaService) { }

    // POST /materias
    @Post()
    crear(@Body() data: CreateMateriaDto) {
        return this.servicio.crear(data);
    }

    // GET /materias
    @Get()
    obtenerTodos() {
        return this.servicio.obtenerTodos();
    }

    // GET /materias/:id
    @Get(':id')
    obtenerPorId(@Param('id', ParseIntPipe) id: number) {
        return this.servicio.obtenerPorId(id);
    }

    // PATCH /materias/:id
    @Patch(':id')
    actualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: UpdateMateriaDto,
    ) {
        return this.servicio.actualizar(id, data);
    }

    // DELETE /materias/:id
    @Delete(':id')
    eliminar(@Param('id', ParseIntPipe) id: number) {
        return this.servicio.eliminar(id);
    }
}

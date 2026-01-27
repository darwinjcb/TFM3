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
import { ServicioPermisoService } from './servicio-permiso.service';
import { CreatePermisoDto } from './create-permiso.dto';
import { UpdatePermisoDto } from './update-permiso.dto';

@Controller('permisos')
export class ControladorPermisoController {
    constructor(private readonly servicio: ServicioPermisoService) { }

    // POST /permisos
    @Post()
    crear(@Body() data: CreatePermisoDto) {
        return this.servicio.crear(data);
    }

    // GET /permisos
    @Get()
    obtenerTodos() {
        return this.servicio.obtenerTodos();
    }

    // GET /permisos/:id
    @Get(':id')
    obtenerPorId(@Param('id', ParseIntPipe) id: number) {
        return this.servicio.obtenerPorId(id);
    }

    // PATCH /permisos/:id
    @Patch(':id')
    actualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: UpdatePermisoDto,
    ) {
        return this.servicio.actualizar(id, data);
    }

    // DELETE /permisos/:id
    @Delete(':id')
    eliminar(@Param('id', ParseIntPipe) id: number) {
        return this.servicio.eliminar(id);
    }
}

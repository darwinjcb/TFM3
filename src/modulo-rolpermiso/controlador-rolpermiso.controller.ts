import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ServicioRolPermisoService } from './servicio-rolpermiso.service';
import { CreateRolPermisoDto } from './create-rolpermiso.dto';
import { UpdateRolPermisoDto } from './update-rolpermiso.dto';

@Controller('rolpermisos')
export class ControladorRolPermisoController {
    constructor(private readonly servicio: ServicioRolPermisoService) { }

    @Get()
    obtenerTodos() {
        return this.servicio.obtenerTodos();
    }

    @Get(':id')
    obtenerPorId(@Param('id') id: string) {
        return this.servicio.obtenerPorId(Number(id));
    }

    @Post()
    crear(@Body() data: CreateRolPermisoDto) {
        return this.servicio.crear(data);
    }

    @Patch(':id')
    actualizar(@Param('id') id: string, @Body() data: UpdateRolPermisoDto) {
        return this.servicio.actualizar(Number(id), data);
    }

    @Delete(':id')
    eliminar(@Param('id') id: string) {
        return this.servicio.eliminar(Number(id));
    }
}

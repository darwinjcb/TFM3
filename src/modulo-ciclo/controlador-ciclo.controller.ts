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
import { ServicioCicloService } from './servicio-ciclo.service';
import { CreateCicloDto } from './create-ciclo.dto';
import { UpdateCicloDto } from './update-ciclo.dto';

@Controller('ciclos')
export class ControladorCicloController {
    constructor(private readonly servicio: ServicioCicloService) { }

    @Get()
    obtenerTodos() {
        return this.servicio.obtenerTodos();
    }

    @Get(':id')
    obtenerPorId(@Param('id', ParseIntPipe) id: number) {
        return this.servicio.obtenerPorId(id);
    }

    @Post()
    crear(@Body() data: CreateCicloDto) {
        return this.servicio.crear(data);
    }

    @Patch(':id')
    actualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: UpdateCicloDto,
    ) {
        return this.servicio.actualizar(id, data);
    }

    @Delete(':id')
    eliminar(@Param('id', ParseIntPipe) id: number) {
        return this.servicio.eliminar(id);
    }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ServicioCarreraService } from './servicio-carrera.service';
import { CreateCarreraDto } from './create-carrera.dto';
import { UpdateCarreraDto } from './update-carrera.dto';

@Controller('carreras')
export class ControladorCarreraController {
  constructor(private readonly servicio: ServicioCarreraService) {}

  @Get()
  obtenerTodos() {
    return this.servicio.obtenerTodos();
  }

  @Get(':id')
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.servicio.obtenerPorId(id);
  }

  @Post()
  crear(@Body() data: CreateCarreraDto) {
    return this.servicio.crear(data);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCarreraDto,
  ) {
    return this.servicio.actualizar(id, data);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.servicio.eliminar(id);
  }
}

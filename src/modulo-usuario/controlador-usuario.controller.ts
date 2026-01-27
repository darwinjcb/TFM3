import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { ServicioUsuario } from './servicio-usuario.service';
import { CreateUsuarioDto } from './create-usuario.dto';
import { UpdateUsuarioDto } from './update-usuario.dto';

@Controller('usuarios')
export class ControladorUsuario {
  constructor(private readonly servicioUsuario: ServicioUsuario) {}

  @Get()
  obtenerTodos() {
    return this.servicioUsuario.obtenerTodos();
  }

  @Get(':id')
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.servicioUsuario.obtenerPorId(id);
  }

  @Post()
  crear(@Body() body: CreateUsuarioDto) {
    return this.servicioUsuario.crear(body);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUsuarioDto,
  ) {
    return this.servicioUsuario.actualizar(id, body);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.servicioUsuario.eliminar(id);
  }
}

// src/modulo-usuario/controlador-usuario.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ServicioUsuario } from './servicio-usuario.service';
import { CreateUsuarioDto } from './create-usuario.dto';
import { UpdateUsuarioDto } from './update-usuario.dto';

@Controller('usuarios')
export class ControladorUsuarioController {
  constructor(private readonly servicioUsuario: ServicioUsuario) { }

  // CONSULTA DERIVADA – PARTE 1
  // ============================
  // GET /usuarios/estudiantes/activos/carrera
  @Get('estudiantes/activos/carrera')
  listarEstudiantesActivosConCarrera() {
    return this.servicioUsuario.listarEstudiantesActivosConCarrera();
  }

  // PARTE 2: OPERADORES LÓGICOS (AND)
  // ============================
  // GET /usuarios/estudiantes/buscar?carreraId=1&cicloId=2
  @Get('estudiantes/buscar')
  buscarEstudiantesActivosPorCarreraYCiclo(
    @Query('carreraId', ParseIntPipe) carreraId: number,
    @Query('cicloId', ParseIntPipe) cicloId: number,
  ) {
    return this.servicioUsuario.buscarEstudiantesActivosPorCarreraYCiclo(
      carreraId,
      cicloId,
    );
  }

  // PARTE 3: CONSULTA NATIVA SQL
  // GET /usuarios/reporte/materias-matriculadas
  @Get('reporte/materias-matriculadas')
  reporteMateriasMatriculadas() {
    return this.servicioUsuario.reporteMateriasMatriculadas();
  }

  // CRUD EXISTENTE:

  @Get()
  obtenerTodos() {
    return this.servicioUsuario.obtenerTodos();
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.servicioUsuario.obtenerPorId(Number(id));
  }

  @Post()
  crear(@Body() data: CreateUsuarioDto) {
    return this.servicioUsuario.crear(data);
  }

  @Patch(':id')
  actualizar(
    @Param('id') id: string,
    @Body() data: UpdateUsuarioDto,
  ) {
    return this.servicioUsuario.actualizar(Number(id), data);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.servicioUsuario.eliminar(Number(id));
  }
}

import { Module } from '@nestjs/common';
import { ModuloPrismaModule } from '../modulo-prisma/modulo-prisma.module';
import { ServicioTitulo } from './servicio-titulo.service';
import { ControladorTitulo } from './controlador-titulo.controller';

@Module({
  imports: [ModuloPrismaModule],
  controllers: [ControladorTitulo],
  providers: [ServicioTitulo],
  exports: [ServicioTitulo],
})
export class ModuloTituloModule { }

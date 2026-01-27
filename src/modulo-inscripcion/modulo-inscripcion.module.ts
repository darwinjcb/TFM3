import { Module } from '@nestjs/common';
import { ControladorInscripcionController } from './controlador-inscripcion.controller';
import { ServicioInscripcionService } from './servicio-inscripcion.service';
import { ModuloPrismaModule } from '../modulo-prisma/modulo-prisma.module';

@Module({
  imports: [ModuloPrismaModule],
  controllers: [ControladorInscripcionController],
  providers: [ServicioInscripcionService],
})
export class ModuloInscripcionModule { }

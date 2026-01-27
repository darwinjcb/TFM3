import { Module } from '@nestjs/common';
import { ControladorCarreraController } from './controlador-carrera.controller';
import { ServicioCarreraService } from './servicio-carrera.service';
import { ModuloPrismaModule } from '../modulo-prisma/modulo-prisma.module';

@Module({
  imports: [ModuloPrismaModule],
  controllers: [ControladorCarreraController],
  providers: [ServicioCarreraService],
})
export class ModuloCarreraModule { }

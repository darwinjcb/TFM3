import { Module } from '@nestjs/common';
import { ControladorPermisoController } from './controlador-permiso.controller';
import { ServicioPermisoService } from './servicio-permiso.service';
import { ModuloPrismaModule } from '../modulo-prisma/modulo-prisma.module';

@Module({
  imports: [ModuloPrismaModule],
  controllers: [ControladorPermisoController],
  providers: [ServicioPermisoService],
})
export class ModuloPermisoModule { }

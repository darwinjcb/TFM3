// src/modulo-profesor/modulo-profesor.module.ts
import { Module } from '@nestjs/common';
import { ModuloPrismaModule } from '../modulo-prisma/modulo-prisma.module';
import { ServicioProfesor } from './servicio-profesor.service';
import { ControladorProfesor } from './controlador-profesor.controller';

@Module({
  imports: [ModuloPrismaModule],
  controllers: [ControladorProfesor],
  providers: [ServicioProfesor],
  exports: [ServicioProfesor],
})
export class ModuloProfesorModule {}

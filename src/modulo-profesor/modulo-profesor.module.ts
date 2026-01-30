// src/modulo-profesor/modulo-profesor.module.ts
import { Module } from '@nestjs/common';
import { ServicioProfesor } from './servicio-profesor.service';
import { ControladorProfesor } from './controlador-profesor.controller';
import { ModuloPrismaModule } from '../modulo-prisma/modulo-prisma.module';

@Module({
  imports: [
    ModuloPrismaModule, // Prisma Profesor + Carrera
  ],
  controllers: [ControladorProfesor],
  providers: [ServicioProfesor],
})
export class ModuloProfesorModule { }

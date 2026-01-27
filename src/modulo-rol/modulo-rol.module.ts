// src/modulo-rol/modulo-rol.module.ts

import { Module } from '@nestjs/common';
import { ControladorRol } from './controlador-rol.controller';
import { ServicioRol } from './servicio-rol.service';
import { ModuloPrismaModule } from '../modulo-prisma/modulo-prisma.module';

@Module({
  imports: [ModuloPrismaModule],
  controllers: [ControladorRol],
  providers: [ServicioRol],
})
export class ModuloRolModule { }

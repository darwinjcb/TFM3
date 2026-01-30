// src/modulo-usuario/modulo-usuario.module.ts:

import { Module } from '@nestjs/common';
import { ServicioUsuario } from './servicio-usuario.service';
import { ControladorUsuarioController } from './controlador-usuario.controller';
import { ModuloPrismaModule } from '../modulo-prisma/modulo-prisma.module';

@Module({
  imports: [ModuloPrismaModule],
  controllers: [ControladorUsuarioController],
  providers: [ServicioUsuario],
})
export class ModuloUsuarioModule {}

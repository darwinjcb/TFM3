import { Module } from '@nestjs/common';
import { ServicioUsuario } from './servicio-usuario.service';
import { ControladorUsuario } from './controlador-usuario.controller';
import { ModuloPrismaModule } from '../modulo-prisma/modulo-prisma.module';

@Module({
  imports: [ModuloPrismaModule],
  controllers: [ControladorUsuario],
  providers: [ServicioUsuario],
})
export class ModuloUsuarioModule {}

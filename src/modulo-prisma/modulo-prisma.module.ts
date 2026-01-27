import { Module } from '@nestjs/common';
import { ServicioPrismaUsuario } from './servicio-usuario/servicio-prisma-usuario.service';
import { ServicioPrismaCarrera } from './servicio-carrera/servicio-prisma-carrera.service';
import { ServicioPrismaProfesor } from './servicio-profesor/servicio-prisma-profesor.service';

@Module({
  providers: [ServicioPrismaUsuario, ServicioPrismaCarrera, ServicioPrismaProfesor],
  exports: [ServicioPrismaUsuario, ServicioPrismaCarrera, ServicioPrismaProfesor],
})
export class ModuloPrismaModule {}

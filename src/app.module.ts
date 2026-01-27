import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModuloPrismaModule } from './modulo-prisma/modulo-prisma.module';
import { ModuloUsuarioModule } from './modulo-usuario/modulo-usuario.module';
import { ModuloProfesorModule } from './modulo-profesor/modulo-profesor.module';
import { ModuloTituloModule } from './modulo-titulo/modulo-titulo.module';
import { ModuloCarreraModule } from './modulo-carrera/modulo-carrera.module';
import { ModuloCicloModule } from './modulo-ciclo/modulo-ciclo.module';
import { ModuloMateriaModule } from './modulo-materia/modulo-materia.module';
import { ModuloInscripcionModule } from './modulo-inscripcion/modulo-inscripcion.module';
import { ModuloPermisoModule } from './modulo-permiso/modulo-permiso.module';
import { ModuloRolModule } from './modulo-rol/modulo-rol.module';
import { ModuloRolPermisoModule } from './modulo-rolpermiso/modulo-rolpermiso.module';

@Module({
  imports: [ModuloPrismaModule, ModuloUsuarioModule, ModuloProfesorModule, ModuloTituloModule, ModuloCarreraModule, ModuloCicloModule, ModuloMateriaModule, ModuloInscripcionModule, ModuloPermisoModule, ModuloRolModule, ModuloRolPermisoModule],
  controllers: [AppController,],
  providers: [AppService,],
})
export class AppModule { }

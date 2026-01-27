import { Module } from '@nestjs/common';
import { ModuloPrismaModule } from '../modulo-prisma/modulo-prisma.module';
import { ControladorRolPermisoController } from './controlador-rolpermiso.controller';
import { ServicioRolPermisoService } from './servicio-rolpermiso.service';

@Module({
    imports: [ModuloPrismaModule],
    controllers: [ControladorRolPermisoController],
    providers: [ServicioRolPermisoService],
})
export class ModuloRolPermisoModule { }

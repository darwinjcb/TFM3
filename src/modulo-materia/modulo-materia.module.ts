import { Module } from '@nestjs/common';
import { ControladorMateriaController } from './controlador-materia.controller';
import { ServicioMateriaService } from './servicio-materia.service';
import { ModuloPrismaModule } from '../modulo-prisma/modulo-prisma.module';

@Module({
  imports: [ModuloPrismaModule],
  controllers: [ControladorMateriaController],
  providers: [ServicioMateriaService],
})
export class ModuloMateriaModule { }

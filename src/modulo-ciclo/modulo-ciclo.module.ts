import { Module } from '@nestjs/common';
import { ModuloPrismaModule } from '../modulo-prisma/modulo-prisma.module';
import { ServicioCicloService } from './servicio-ciclo.service';
import { ControladorCicloController } from './controlador-ciclo.controller';

@Module({
  imports: [ModuloPrismaModule],
  controllers: [ControladorCicloController],
  providers: [ServicioCicloService],
  exports: [ServicioCicloService],
})
export class ModuloCicloModule {}

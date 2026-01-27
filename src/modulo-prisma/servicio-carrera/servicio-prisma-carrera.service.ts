// src/modulo-prisma/servicio-carrera/servicio-prisma-carrera.service.ts

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient as CarreraPrismaClient } from '@prisma/client-carrera';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class ServicioPrismaCarrera
  extends CarreraPrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL_CARRERA!,
    });

    super({ adapter });
  }

  async onModuleInit() {
    // await this.$connect();
  }

  async onModuleDestroy() {
    // await this.$disconnect();
  }
}

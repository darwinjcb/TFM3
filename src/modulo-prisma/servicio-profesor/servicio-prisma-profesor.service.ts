import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient as ProfesorPrismaClient } from '@prisma/client-profesor';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class ServicioPrismaProfesor
  extends ProfesorPrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL_PROFESOR!,
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

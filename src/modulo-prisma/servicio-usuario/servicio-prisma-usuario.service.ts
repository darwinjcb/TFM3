import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient as UsuarioPrismaClient } from '@prisma/client-usuario';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class ServicioPrismaUsuario
  extends UsuarioPrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL_USUARIO!,
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

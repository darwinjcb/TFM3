import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInscripcionDto {
    @IsInt()
    @Type(() => Number)
    usuarioId: number;

    @IsInt()
    @Type(() => Number)
    carreraId: number;

    @IsInt()
    @Type(() => Number)
    cicloId: number;

    // En el schema tiene default(now()), así que es opcional aquí
    @IsOptional()
    fechaInicio?: Date;
}

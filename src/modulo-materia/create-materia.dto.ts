import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMateriaDto {
    @IsString()
    nombre: string;

    @IsString()
    codigo: string;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    creditos?: number;

    @IsInt()
    @Type(() => Number)
    carreraId: number;

    @IsInt()
    @Type(() => Number)
    cicloId: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    inscripcionId?: number;
}

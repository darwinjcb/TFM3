import {
    IsInt,
    IsOptional,
    IsString,
    MaxLength,
    Min,
} from 'class-validator';

export class CreateTituloDto {
    @IsString()
    @MaxLength(150)
    nombre: string; // "Ingeniero en Sistemas", "Magíster en ..."

    @IsOptional()
    @IsString()
    @MaxLength(150)
    institucion?: string;

    @IsOptional()
    @IsInt()
    @Min(1900)
    anioObtencion?: number;

    @IsInt()
    @Min(1)
    profesorId: number; // fk al profesor
}

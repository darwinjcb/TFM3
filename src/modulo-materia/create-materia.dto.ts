// src/modulo-materia/create-materia.dto.ts:
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMateriaDto {
    @IsString()
    nombre: string;
    @IsString()
    codigo: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    creditos?: number;

    @IsInt()
    @Type(() => Number)
    carreraId: number;

    @IsInt()
    @Type(() => Number)
    cicloId: number;

    // ============================
    // NUEVOS CAMPOS NECESARIOS
    // ============================

    // Docente que dicta la materia
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    profesorId?: number;

    // Cupos disponibles (Parte 4 – Transacción)
    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    cuposDisponibles?: number;

    // Se usa cuando se registra la matrícula
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    inscripcionId?: number;
}

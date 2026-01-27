// src/modulo-rol/update-rol.dto.ts

import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateRolDto {
    @IsOptional()
    @IsString()
    @MaxLength(80)
    nombre?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    descripcion?: string;

    @IsOptional()
    @IsBoolean()
    esSistema?: boolean;
}

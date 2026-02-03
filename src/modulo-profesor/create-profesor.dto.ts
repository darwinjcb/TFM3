// src/modulo-profesor/create-profesor.dto.ts
// src/modulo-profesor/create-profesor.dto.ts
import {
    IsEmail,
    IsOptional,
    IsString,
    IsBoolean,
    MaxLength,
} from 'class-validator';

export class CreateProfesorDto {
    @IsString()
    @MaxLength(100)
    nombres: string;

    @IsString()
    @MaxLength(100)
    apellidos: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    telefono?: string;

    @IsOptional()
    @IsBoolean()
    tiempoCompleto?: boolean;
}

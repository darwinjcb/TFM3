export class CreateUsuario { }
// src/modulo-usuario/create-usuario.dto.ts
import { IsEmail, IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUsuarioDto {
    @IsString()
    nombre: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsInt()
    rolId: number;

    @IsOptional()
    @IsInt()
    profesorId?: number;
}

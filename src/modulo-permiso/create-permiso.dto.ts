import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePermisoDto {
    @IsString()
    @IsNotEmpty()
    codigo: string; // VER_CATALOGO, RESERVAR_LIBRO, etc.

    @IsString()
    @IsOptional()
    descripcion?: string;

    @IsString()
    @IsOptional()
    categoria?: string; // LIBROS, USUARIOS, CARRERAS...
}

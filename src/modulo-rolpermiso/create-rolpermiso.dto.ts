import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class CreateRolPermisoDto {
    @Type(() => Number)
    @IsInt()
    rolId: number;

    @Type(() => Number)
    @IsInt()
    permisoId: number;
}

export class CreateCursoDto {
  readonly nombre: string;
  readonly codigo: string;
  readonly docenteId: string;
  readonly horario: string;
  readonly semestre: string;
  readonly aula?: string;
}

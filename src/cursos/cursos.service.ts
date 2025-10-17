import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Curso } from './curso.schema';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Injectable()
export class CursosService {
  constructor(@InjectModel(Curso.name) private cursoModel: Model<Curso>) {}

  async create(createCursoDto: CreateCursoDto): Promise<Curso> {
    const nuevo = new this.cursoModel(createCursoDto);
    return nuevo.save();
  }

  async findAll(): Promise<Curso[]> {
    return this.cursoModel.find().populate('docenteId', 'nombre email').exec();
  }

  async findOne(id: string): Promise<Curso | null> {
    return this.cursoModel.findById(id).populate('docenteId', 'nombre email').exec();
  }

  async update(id: string, updateCursoDto: UpdateCursoDto): Promise<Curso | null> {
    return this.cursoModel.findByIdAndUpdate(id, updateCursoDto, { new: true });
  }

  async remove(id: string): Promise<Curso | null> {
    return this.cursoModel.findByIdAndDelete(id);
  }

  async importarDesdeExcel(data: any[]): Promise<any> {
  const resultados: any[] = [];

  for (const fila of data) {
    const curso = {
      nombre: fila['Nombre'] || fila['nombre'],
      codigo: fila['Código'] || fila['codigo'],
      docenteId: fila['DocenteId'] || fila['docenteId'],
      horario: fila['Horario'] || fila['horario'],
      semestre: fila['Semestre'] || fila['semestre'],
      aula: fila['Aula'] || fila['aula'],
    };

    // Solo guarda si el código no existe aún
    const existente = await this.cursoModel.findOne({ codigo: curso.codigo });
    if (!existente) {
      const nuevo = new this.cursoModel(curso);
      const guardado = await nuevo.save();
      resultados.push(guardado);
    }
  }

  return {
    mensaje: `Se importaron ${resultados.length} cursos correctamente`,
    cursos: resultados,
  };
}
}



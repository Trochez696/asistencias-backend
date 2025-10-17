import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Asistencia } from './asistencia.schema';

@Injectable()
export class AsistenciasService {
  constructor(
    @InjectModel(Asistencia.name)
    private readonly asistenciaModel: Model<Asistencia>,
  ) {}

  // Registrar una asistencia
  async crearAsistencia(data: any): Promise<Asistencia> {
    const nuevaAsistencia = new this.asistenciaModel(data);
    return nuevaAsistencia.save();
  }

  // Obtener todas las asistencias
  async obtenerAsistencias(): Promise<Asistencia[]> {
    return this.asistenciaModel.find().exec();
  }

  // Obtener asistencias por docente
  async obtenerPorDocente(docenteId: string): Promise<Asistencia[]> {
    return this.asistenciaModel.find({ docenteId }).exec();
  }

  // Obtener asistencias por curso
  async obtenerPorCurso(cursoId: string): Promise<Asistencia[]> {
    return this.asistenciaModel.find({ cursoId }).exec();
  }
}

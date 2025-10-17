import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Agenda } from './agenda.schema';
import * as XLSX from 'xlsx';
import { Express } from 'express';

@Injectable()
export class AgendaService {
  constructor(
    @InjectModel(Agenda.name)
    private readonly agendaModel: Model<Agenda>,
  ) {}

  // 📥 Importar agenda desde un archivo Excel
  async importarAgenda(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Debe subir un archivo Excel válido.');
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const hoja = workbook.Sheets[workbook.SheetNames[0]];
    const datos = XLSX.utils.sheet_to_json(hoja);

    if (!datos.length) {
      throw new BadRequestException('El archivo está vacío o mal estructurado.');
    }

    // Limpiamos la colección antes de importar (opcional)
    await this.agendaModel.deleteMany({});

    // Mapeamos los datos del Excel a nuestro modelo
    const registros = datos.map((fila: any) => ({
      cursoId: String(fila['Curso ID'] || ''),
      docenteId: String(fila['Docente ID'] || ''),
      nombreCurso: String(fila['Nombre Curso'] || ''),
      nombreDocente: String(fila['Nombre Docente'] || ''),
      diaSemana: String(fila['Día Semana'] || ''),
      horaInicio: String(fila['Hora Inicio'] || ''),
      horaFin: String(fila['Hora Fin'] || ''),
      salon: String(fila['Salón'] || ''),
    }));

    const resultado = await this.agendaModel.insertMany(registros);
    return {
      mensaje: `Se importaron ${resultado.length} registros correctamente.`,
      total: resultado.length,
    };
  }

  // 📄 Obtener toda la agenda
  async obtenerAgenda() {
    return this.agendaModel.find().lean();
  }
}

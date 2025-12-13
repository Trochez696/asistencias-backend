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

  // 📥 Importar agenda del semestre desde Excel
  async importarAgenda(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Debe subir un archivo Excel');
    }

    if (!file.originalname.endsWith('.xlsx')) {
      throw new BadRequestException('El archivo debe tener formato .xlsx');
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const hoja = workbook.Sheets[workbook.SheetNames[0]];
    const datos = XLSX.utils.sheet_to_json(hoja, { defval: '' });

    if (!datos.length) {
      throw new BadRequestException('El archivo Excel no contiene registros');
    }

    const errores: string[] = [];
    let procesados = 0;

    for (let i = 0; i < datos.length; i++) {
      const fila = datos[i] as any;
      const filaExcel = i + 2;

      const cursoId = String(fila['Curso ID']).trim();
      const docenteId = String(fila['Docente ID']).trim();
      const nombreCurso = String(fila['Nombre Curso']).trim();
      const nombreDocente = String(fila['Nombre Docente']).trim();
      const diaSemana = String(fila['Día Semana']).trim();
      const horaInicio = String(fila['Hora Inicio']).trim();
      const horaFin = String(fila['Hora Fin']).trim();
      const salon = String(fila['Salón']).trim();

      if (
        !cursoId ||
        !docenteId ||
        !nombreCurso ||
        !nombreDocente ||
        !diaSemana ||
        !horaInicio ||
        !horaFin ||
        !salon
      ) {
        errores.push(`Fila ${filaExcel}: campos obligatorios incompletos`);
        continue;
      }

      if (!this.diaSemanaValido(diaSemana)) {
        errores.push(`Fila ${filaExcel}: día de la semana inválido`);
        continue;
      }

      if (!this.horaValida(horaInicio) || !this.horaValida(horaFin)) {
        errores.push(`Fila ${filaExcel}: formato de hora inválido`);
        continue;
      }

      if (horaInicio >= horaFin) {
        errores.push(
          `Fila ${filaExcel}: la hora de inicio debe ser menor que la hora fin`,
        );
        continue;
      }

      try {
        await this.agendaModel.findOneAndUpdate(
          {
            cursoId,
            diaSemana,
            horaInicio,
            horaFin,
          },
          {
            cursoId,
            docenteId,
            nombreCurso,
            nombreDocente,
            diaSemana,
            horaInicio,
            horaFin,
            salon,
          },
          { upsert: true, new: true },
        );

        procesados++;
      } catch (error) {
        errores.push(`Fila ${filaExcel}: conflicto al guardar el registro`);
      }
    }

    if (errores.length > 0) {
      throw new BadRequestException({
        mensaje: 'El archivo contiene errores y no fue importado',
        errores,
      });
    }

    return {
      mensaje: 'Agenda del semestre importada correctamente',
      registrosProcesados: procesados,
    };
  }

  // 📄 Consultar agenda completa
  async obtenerAgenda() {
    return this.agendaModel
      .find()
      .sort({ diaSemana: 1, horaInicio: 1 })
      .lean();
  }

  private horaValida(hora: string): boolean {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(hora);
  }

  private diaSemanaValido(dia: string): boolean {
    return [
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ].includes(dia);
  }
}

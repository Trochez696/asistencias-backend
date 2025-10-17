import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Asistencia } from 'src/asistencias/asistencia.schema';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class ReportesService {
  constructor(
    @InjectModel(Asistencia.name)
    private readonly asistenciaModel: Model<Asistencia>,
  ) {}

  // Reporte general de asistencias
  async generarReporteAsistencias(res: Response) {
    const asistencias = await this.asistenciaModel.find().lean();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Asistencias');

    worksheet.columns = [
      { header: 'Docente ID', key: 'docenteId', width: 20 },
      { header: 'Curso ID', key: 'cursoId', width: 15 },
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Estado', key: 'estado', width: 15 },
      { header: 'Observaciones', key: 'observaciones', width: 30 },
    ];

    asistencias.forEach((a) => worksheet.addRow(a));

    worksheet.getRow(1).font = { bold: true };

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="reporte_asistencias.xlsx"',
    );

    await workbook.xlsx.write(res);
    res.end();
  }
}

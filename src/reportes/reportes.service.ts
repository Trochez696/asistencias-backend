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

  // 📄 Reporte general de asistencias
  async generarReporteAsistencias(
    res: Response,
    docenteId?: string,
    fechaInicio?: string,
    fechaFin?: string,
  ) {
    const filtros: any = {};
    if (docenteId) filtros.docenteId = docenteId;
    if (fechaInicio && fechaFin)
      filtros.fecha = { $gte: new Date(fechaInicio), $lte: new Date(fechaFin) };

    const asistencias = await this.asistenciaModel.find(filtros).lean();

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

  // ⏱️ Reporte de horas dictadas por docente
  async generarReporteHorasPorDocente(
    res: Response,
    docenteId?: string,
    fechaInicio?: string,
    fechaFin?: string,
  ) {
    const filtros: any = {};
    if (docenteId) filtros.docenteId = docenteId;
    if (fechaInicio && fechaFin)
      filtros.fecha = { $gte: new Date(fechaInicio), $lte: new Date(fechaFin) };

    const agregados = await this.asistenciaModel.aggregate([
      { $match: filtros },
      {
        $group: {
          _id: '$docenteId',
          totalHoras: { $sum: '$horasDictadas' },
          totalClases: { $sum: 1 },
        },
      },
    ]);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Horas por Docente');

    worksheet.columns = [
      { header: 'Docente ID', key: 'docenteId', width: 25 },
      { header: 'Total de Clases', key: 'totalClases', width: 20 },
      { header: 'Total de Horas Dictadas', key: 'totalHoras', width: 25 },
    ];

    agregados.forEach((d) =>
      worksheet.addRow({
        docenteId: d._id,
        totalClases: d.totalClases,
        totalHoras: d.totalHoras,
      }),
    );

    worksheet.getRow(1).font = { bold: true };

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="reporte_horas_docentes.xlsx"',
    );

    await workbook.xlsx.write(res);
    res.end();
  }

  // ⚠️ Reporte de incidencias
  async generarReporteIncidencias(
    res: Response,
    docenteId?: string,
    fechaInicio?: string,
    fechaFin?: string,
  ) {
    const filtros: any = { estado: { $ne: 'Presente' } };
    if (docenteId) filtros.docenteId = docenteId;
    if (fechaInicio && fechaFin)
      filtros.fecha = { $gte: new Date(fechaInicio), $lte: new Date(fechaFin) };

    const incidencias = await this.asistenciaModel.find(filtros).lean();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Incidencias');

    worksheet.columns = [
      { header: 'Docente ID', key: 'docenteId', width: 20 },
      { header: 'Curso ID', key: 'cursoId', width: 15 },
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Estado', key: 'estado', width: 15 },
      { header: 'Observaciones', key: 'observaciones', width: 30 },
    ];

    incidencias.forEach((i) => worksheet.addRow(i));
    worksheet.getRow(1).font = { bold: true };

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="reporte_incidencias.xlsx"',
    );

    await workbook.xlsx.write(res);
    res.end();
  }

  // 📊 Reporte general combinado (3 hojas)
  async generarReporteGeneral(res: Response, fechaInicio?: string, fechaFin?: string) {
    const filtros: any = {};
    if (fechaInicio && fechaFin)
      filtros.fecha = { $gte: new Date(fechaInicio), $lte: new Date(fechaFin) };

    const asistencias = await this.asistenciaModel.find(filtros).lean();

    // Agrupar para horas
    const agregados = await this.asistenciaModel.aggregate([
      { $match: filtros },
      {
        $group: {
          _id: '$docenteId',
          totalHoras: { $sum: '$horasDictadas' },
          totalClases: { $sum: 1 },
        },
      },
    ]);

    // Filtrar incidencias
    const incidencias = asistencias.filter((a) => a.estado !== 'Presente');

    const workbook = new ExcelJS.Workbook();

    // 🟢 Hoja 1: Asistencias
    const wsAsist = workbook.addWorksheet('Asistencias');
    wsAsist.columns = [
      { header: 'Docente ID', key: 'docenteId', width: 20 },
      { header: 'Curso ID', key: 'cursoId', width: 15 },
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Estado', key: 'estado', width: 15 },
      { header: 'Observaciones', key: 'observaciones', width: 30 },
    ];
    asistencias.forEach((a) => wsAsist.addRow(a));
    wsAsist.getRow(1).font = { bold: true };

    // 🕐 Hoja 2: Horas por Docente
    const wsHoras = workbook.addWorksheet('Horas por Docente');
    wsHoras.columns = [
      { header: 'Docente ID', key: 'docenteId', width: 25 },
      { header: 'Total de Clases', key: 'totalClases', width: 20 },
      { header: 'Total de Horas Dictadas', key: 'totalHoras', width: 25 },
    ];
    agregados.forEach((d) =>
      wsHoras.addRow({
        docenteId: d._id,
        totalClases: d.totalClases,
        totalHoras: d.totalHoras,
      }),
    );
    wsHoras.getRow(1).font = { bold: true };

    // ⚠️ Hoja 3: Incidencias
    const wsIncid = workbook.addWorksheet('Incidencias');
    wsIncid.columns = wsAsist.columns;
    incidencias.forEach((i) => wsIncid.addRow(i));
    wsIncid.getRow(1).font = { bold: true };

    // 🧾 Enviar el Excel
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_general.xlsx"');

    await workbook.xlsx.write(res);
    res.end();
  }
}

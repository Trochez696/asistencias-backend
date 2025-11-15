// src/reportes/reportes.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Asistencia } from 'src/asistencias/asistencia.schema';
import { Docente } from 'src/docentes/entities/docente.entity';
import { Curso } from 'src/cursos/curso.schema';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class ReportesService {
  constructor(
    @InjectModel(Asistencia.name)
    private readonly asistenciaModel: Model<Asistencia>,
    @InjectModel(Docente.name)
    private readonly docenteModel: Model<Docente>,
    @InjectModel(Curso.name)
    private readonly cursoModel: Model<Curso>,
  ) {}

  // 📊 REPORTE DE ASISTENCIAS
  async generarReporteAsistencias(
    res: Response,
    docenteId?: string,
    fechaInicio?: string,
    fechaFin?: string,
  ) {
    const filtros: any = {};
    if (docenteId) filtros.docenteId = docenteId;
    if (fechaInicio && fechaFin) {
      filtros.fecha = { 
        $gte: new Date(fechaInicio), 
        $lte: new Date(fechaFin) 
      };
    }

    const asistencias = await this.asistenciaModel.find(filtros)
      .populate('docenteId', 'nombre email')
      .populate('cursoId', 'nombre codigo')
      .lean();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Asistencias');

    // Encabezados
    worksheet.columns = [
      { header: 'Docente', key: 'docente', width: 25 },
      { header: 'Curso', key: 'curso', width: 25 },
      { header: 'Código Curso', key: 'codigoCurso', width: 15 },
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Estado', key: 'estado', width: 12 },
      { header: 'Horas Dictadas', key: 'horas', width: 15 },
      { header: 'Observaciones', key: 'observaciones', width: 30 },
    ];

    // Datos
    asistencias.forEach((asistencia: any) => {
      worksheet.addRow({
        docente: asistencia.docenteId?.nombre || 'N/A',
        curso: asistencia.cursoId?.nombre || 'N/A',
        codigoCurso: asistencia.cursoId?.codigo || 'N/A',
        fecha: new Date(asistencia.fecha).toLocaleDateString(),
        estado: asistencia.estado,
        horas: asistencia.horasDictadas,
        observaciones: asistencia.observaciones || 'Sin observaciones'
      });
    });

    // Estilo encabezados
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6E6FA' }
    };

    await this.enviarExcel(res, workbook, 'reporte_asistencias');
  }

  // ⏱️ REPORTE DE HORAS POR DOCENTE
  async generarReporteHorasPorDocente(
    res: Response,
    docenteId?: string,
    fechaInicio?: string,
    fechaFin?: string,
  ) {
    const filtros: any = {};
    if (docenteId) filtros.docenteId = docenteId;
    if (fechaInicio && fechaFin) {
      filtros.fecha = { 
        $gte: new Date(fechaInicio), 
        $lte: new Date(fechaFin) 
      };
    }

    const agregados = await this.asistenciaModel.aggregate([
      { $match: filtros },
      {
        $lookup: {
          from: 'docentes',
          localField: 'docenteId',
          foreignField: '_id',
          as: 'docente'
        }
      },
      { $unwind: '$docente' },
      {
        $group: {
          _id: '$docenteId',
          nombreDocente: { $first: '$docente.nombre' },
          totalHoras: { $sum: '$horasDictadas' },
          totalClases: { $sum: 1 },
          presentes: { 
            $sum: { 
              $cond: [{ $eq: ['$estado', 'Presente'] }, 1, 0] 
            } 
          },
          ausentes: { 
            $sum: { 
              $cond: [{ $eq: ['$estado', 'Ausente'] }, 1, 0] 
            } 
          },
          tardes: { 
            $sum: { 
              $cond: [{ $eq: ['$estado', 'Tarde'] }, 1, 0] 
            } 
          }
        }
      }
    ]);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Horas por Docente');

    worksheet.columns = [
      { header: 'Docente', key: 'docente', width: 30 },
      { header: 'Total Clases', key: 'totalClases', width: 15 },
      { header: 'Clases Presente', key: 'presentes', width: 15 },
      { header: 'Clases Ausente', key: 'ausentes', width: 15 },
      { header: 'Clases Tarde', key: 'tardes', width: 15 },
      { header: 'Total Horas', key: 'totalHoras', width: 15 },
    ];

    agregados.forEach((docente) => {
      worksheet.addRow({
        docente: docente.nombreDocente,
        totalClases: docente.totalClases,
        presentes: docente.presentes,
        ausentes: docente.ausentes,
        tardes: docente.tardes,
        totalHoras: docente.totalHoras
      });
    });

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF0F8FF' }
    };

    await this.enviarExcel(res, workbook, 'reporte_horas_docentes');
  }

  // 📚 REPORTE DE HORAS POR CURSO (NUEVO)
  async generarReporteHorasPorCurso(
    res: Response,
    cursoId?: string,
    fechaInicio?: string,
    fechaFin?: string,
  ) {
    const filtros: any = {};
    if (cursoId) filtros.cursoId = cursoId;
    if (fechaInicio && fechaFin) {
      filtros.fecha = { 
        $gte: new Date(fechaInicio), 
        $lte: new Date(fechaFin) 
      };
    }

    const agregados = await this.asistenciaModel.aggregate([
      { $match: filtros },
      {
        $lookup: {
          from: 'cursos',
          localField: 'cursoId',
          foreignField: '_id',
          as: 'curso'
        }
      },
      { $unwind: '$curso' },
      {
        $group: {
          _id: '$cursoId',
          nombreCurso: { $first: '$curso.nombre' },
          codigoCurso: { $first: '$curso.codigo' },
          totalHoras: { $sum: '$horasDictadas' },
          totalClases: { $sum: 1 },
          cantidadDocentes: { $addToSet: '$docenteId' }
        }
      },
      {
        $project: {
          nombreCurso: 1,
          codigoCurso: 1,
          totalHoras: 1,
          totalClases: 1,
          cantidadDocentes: { $size: '$cantidadDocentes' }
        }
      }
    ]);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Horas por Curso');

    worksheet.columns = [
      { header: 'Curso', key: 'curso', width: 30 },
      { header: 'Código', key: 'codigo', width: 15 },
      { header: 'Total Clases', key: 'totalClases', width: 15 },
      { header: 'Total Horas', key: 'totalHoras', width: 15 },
      { header: 'Docentes Asignados', key: 'cantidadDocentes', width: 18 },
    ];

    agregados.forEach((curso) => {
      worksheet.addRow({
        curso: curso.nombreCurso,
        codigo: curso.codigoCurso,
        totalClases: curso.totalClases,
        totalHoras: curso.totalHoras,
        cantidadDocentes: curso.cantidadDocentes
      });
    });

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF0FFF0' }
    };

    await this.enviarExcel(res, workbook, 'reporte_horas_cursos');
  }

  // ⚠️ REPORTE DE INCIDENCIAS
  async generarReporteIncidencias(
    res: Response,
    docenteId?: string,
    fechaInicio?: string,
    fechaFin?: string,
  ) {
    const filtros: any = { estado: { $ne: 'Presente' } };
    if (docenteId) filtros.docenteId = docenteId;
    if (fechaInicio && fechaFin) {
      filtros.fecha = { 
        $gte: new Date(fechaInicio), 
        $lte: new Date(fechaFin) 
      };
    }

    const incidencias = await this.asistenciaModel.find(filtros)
      .populate('docenteId', 'nombre email')
      .populate('cursoId', 'nombre codigo')
      .lean();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Incidencias');

    worksheet.columns = [
      { header: 'Docente', key: 'docente', width: 25 },
      { header: 'Curso', key: 'curso', width: 25 },
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Tipo Incidencia', key: 'estado', width: 15 },
      { header: 'Horas Perdidas', key: 'horas', width: 15 },
      { header: 'Observaciones', key: 'observaciones', width: 40 },
    ];

    incidencias.forEach((incidencia: any) => {
      worksheet.addRow({
        docente: incidencia.docenteId?.nombre || 'N/A',
        curso: incidencia.cursoId?.nombre || 'N/A',
        fecha: new Date(incidencia.fecha).toLocaleDateString(),
        estado: incidencia.estado,
        horas: incidencia.horasDictadas,
        observaciones: incidencia.observaciones || 'Sin observaciones'
      });
    });

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFF0F0' }
    };

    await this.enviarExcel(res, workbook, 'reporte_incidencias');
  }

  // 🧾 REPORTE GENERAL COMBINADO
  async generarReporteGeneral(res: Response, fechaInicio?: string, fechaFin?: string) {
    const filtros: any = {};
    if (fechaInicio && fechaFin) {
      filtros.fecha = { 
        $gte: new Date(fechaInicio), 
        $lte: new Date(fechaFin) 
      };
    }

    const [asistencias, horasDocentes, horasCursos] = await Promise.all([
      this.asistenciaModel.find(filtros)
        .populate('docenteId', 'nombre')
        .populate('cursoId', 'nombre codigo')
        .lean(),
      this.asistenciaModel.aggregate([
        { $match: filtros },
        { $lookup: { from: 'docentes', localField: 'docenteId', foreignField: '_id', as: 'docente' }},
        { $unwind: '$docente' },
        { $group: { _id: '$docenteId', nombreDocente: { $first: '$docente.nombre' }, totalHoras: { $sum: '$horasDictadas' }, totalClases: { $sum: 1 } }}
      ]),
      this.asistenciaModel.aggregate([
        { $match: filtros },
        { $lookup: { from: 'cursos', localField: 'cursoId', foreignField: '_id', as: 'curso' }},
        { $unwind: '$curso' },
        { $group: { _id: '$cursoId', nombreCurso: { $first: '$curso.nombre' }, codigoCurso: { $first: '$curso.codigo' }, totalHoras: { $sum: '$horasDictadas' }, totalClases: { $sum: 1 } }}
      ])
    ]);

    const workbook = new ExcelJS.Workbook();

    // Hoja 1: Asistencias
    const wsAsist = workbook.addWorksheet('Asistencias');
    wsAsist.columns = [
      { header: 'Docente', key: 'docente', width: 25 },
      { header: 'Curso', key: 'curso', width: 25 },
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Estado', key: 'estado', width: 12 },
      { header: 'Horas', key: 'horas', width: 10 },
    ];
    asistencias.forEach((a: any) => wsAsist.addRow({
      docente: a.docenteId?.nombre,
      curso: a.cursoId?.nombre,
      fecha: new Date(a.fecha).toLocaleDateString(),
      estado: a.estado,
      horas: a.horasDictadas
    }));
    wsAsist.getRow(1).font = { bold: true };

    // Hoja 2: Horas por Docente
    const wsHorasDoc = workbook.addWorksheet('Horas por Docente');
    wsHorasDoc.columns = [
      { header: 'Docente', key: 'docente', width: 30 },
      { header: 'Total Clases', key: 'clases', width: 15 },
      { header: 'Total Horas', key: 'horas', width: 15 },
    ];
    horasDocentes.forEach(d => wsHorasDoc.addRow({
      docente: d.nombreDocente,
      clases: d.totalClases,
      horas: d.totalHoras
    }));
    wsHorasDoc.getRow(1).font = { bold: true };

    // Hoja 3: Horas por Curso
    const wsHorasCur = workbook.addWorksheet('Horas por Curso');
    wsHorasCur.columns = [
      { header: 'Curso', key: 'curso', width: 30 },
      { header: 'Código', key: 'codigo', width: 15 },
      { header: 'Total Clases', key: 'clases', width: 15 },
      { header: 'Total Horas', key: 'horas', width: 15 },
    ];
    horasCursos.forEach(c => wsHorasCur.addRow({
      curso: c.nombreCurso,
      codigo: c.codigoCurso,
      clases: c.totalClases,
      horas: c.totalHoras
    }));
    wsHorasCur.getRow(1).font = { bold: true };

    await this.enviarExcel(res, workbook, 'reporte_general');
  }

  // 🔧 MÉTODO AUXILIAR PARA ENVIAR EXCEL
  private async enviarExcel(res: Response, workbook: ExcelJS.Workbook, filename: string) {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);
    
    await workbook.xlsx.write(res);
    res.end();
  }

  // 📊 FILTROS DE CONSULTA (JSON)
  async filtrarPorDocente(docenteId: string) {
    return this.asistenciaModel.find({ docenteId })
      .populate('docenteId', 'nombre email')
      .populate('cursoId', 'nombre codigo')
      .lean();
  }

  async filtrarPorCurso(cursoId: string) {
    return this.asistenciaModel.find({ cursoId })
      .populate('docenteId', 'nombre email')
      .populate('cursoId', 'nombre codigo')
      .lean();
  }

  async filtrarPorFechas(fechaInicio: string, fechaFin: string) {
    return this.asistenciaModel.find({
      fecha: {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin),
      },
    })
    .populate('docenteId', 'nombre email')
    .populate('cursoId', 'nombre codigo')
    .lean();
  }
}
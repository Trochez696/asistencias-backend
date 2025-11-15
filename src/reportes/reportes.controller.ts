// src/reportes/reportes.controller.ts
import { Controller, Get, Query, Res } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { Response } from 'express';

@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  // 📊 Reporte general de asistencias
  @Get('asistencias')
  async descargarReporteAsistencias(
    @Res() res: Response,
    @Query('docenteId') docenteId?: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return this.reportesService.generarReporteAsistencias(
      res,
      docenteId,
      fechaInicio,
      fechaFin,
    );
  }

  // ⏱️ Reporte de horas dictadas por docente
  @Get('horas-docentes')
  async descargarReporteHoras(
    @Res() res: Response,
    @Query('docenteId') docenteId?: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return this.reportesService.generarReporteHorasPorDocente(
      res,
      docenteId,
      fechaInicio,
      fechaFin,
    );
  }

  // 📚 NUEVO: Reporte de horas por curso
  @Get('horas-cursos')
  async descargarReporteHorasCursos(
    @Res() res: Response,
    @Query('cursoId') cursoId?: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return this.reportesService.generarReporteHorasPorCurso(
      res,
      cursoId,
      fechaInicio,
      fechaFin,
    );
  }

  // ⚠️ Reporte de incidencias
  @Get('incidencias')
  async descargarReporteIncidencias(
    @Res() res: Response,
    @Query('docenteId') docenteId?: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return this.reportesService.generarReporteIncidencias(
      res,
      docenteId,
      fechaInicio,
      fechaFin,
    );
  }

  // 🧾 Reporte general combinado (3 hojas)
  @Get('general')
  async descargarReporteGeneral(
    @Res() res: Response,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return this.reportesService.generarReporteGeneral(res, fechaInicio, fechaFin);
  }

  // -----------------------------------------------------------
  // 🔍 FILTROS DE CONSULTA (sin generar Excel)
  // -----------------------------------------------------------

  // 🔹 Filtrar asistencias por docente
  @Get('filtro/docente')
  async filtrarPorDocente(@Query('docenteId') docenteId: string) {
    return this.reportesService.filtrarPorDocente(docenteId);
  }

  // 🔹 Filtrar asistencias por curso
  @Get('filtro/curso')
  async filtrarPorCurso(@Query('cursoId') cursoId: string) {
    return this.reportesService.filtrarPorCurso(cursoId);
  }

  // 🔹 Filtrar asistencias por rango de fechas
  @Get('filtro/fechas')
  async filtrarPorFechas(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    return this.reportesService.filtrarPorFechas(fechaInicio, fechaFin);
  }
}
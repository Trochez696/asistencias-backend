import { Controller, Get, Query, Res } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { Response } from 'express';

@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  //Reporte general de asistencias
  @Get('asistencias')
  async descargarReporteAsistencias(
    @Res() res: Response,
    @Query('docenteId') docenteId?: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return this.reportesService.generarReporteAsistencias(res, docenteId, fechaInicio, fechaFin);
  }

  //Reporte de horas dictadas por docente
  @Get('horas-docentes')
  async descargarReporteHoras(
    @Res() res: Response,
    @Query('docenteId') docenteId?: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return this.reportesService.generarReporteHorasPorDocente(res, docenteId, fechaInicio, fechaFin);
  }

  //Reporte de incidencias
  @Get('incidencias')
  async descargarReporteIncidencias(
    @Res() res: Response,
    @Query('docenteId') docenteId?: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return this.reportesService.generarReporteIncidencias(res, docenteId, fechaInicio, fechaFin);
  }

  //Reporte general combinado
@Get('general')
async descargarReporteGeneral(
  @Res() res: Response,
  @Query('fechaInicio') fechaInicio?: string,
  @Query('fechaFin') fechaFin?: string,
) {
  return this.reportesService.generarReporteGeneral(res, fechaInicio, fechaFin);
}
}

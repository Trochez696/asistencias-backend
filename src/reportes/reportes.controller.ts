import { Controller, Get, Res } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { Response } from 'express';

@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  // Reporte general de asistencias
  @Get('asistencias')
  async descargarReporteAsistencias(@Res() res: Response) {
    return this.reportesService.generarReporteAsistencias(res);
  }
}

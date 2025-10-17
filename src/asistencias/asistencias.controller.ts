import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AsistenciasService } from './asistencias.service';

@Controller('asistencias')
export class AsistenciasController {
  constructor(private readonly asistenciasService: AsistenciasService) {}

  @Post()
  async crearAsistencia(@Body() data: any) {
    const asistencia = await this.asistenciasService.crearAsistencia(data);
    return {
      mensaje: 'Asistencia registrada correctamente',
      asistencia,
    };
  }

  @Get()
  async obtenerTodas() {
    return this.asistenciasService.obtenerAsistencias();
  }

  @Get('docente/:docenteId')
  async obtenerPorDocente(@Param('docenteId') docenteId: string) {
    return this.asistenciasService.obtenerPorDocente(docenteId);
  }

  @Get('curso/:cursoId')
  async obtenerPorCurso(@Param('cursoId') cursoId: string) {
    return this.asistenciasService.obtenerPorCurso(cursoId);
  }
}

// src/reportes/reportes.module.ts
import { Module } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Asistencia, AsistenciaSchema } from 'src/asistencias/asistencia.schema';
import { Docente, DocenteSchema } from 'src/docentes/entities/docente.entity';
import { Curso, CursoSchema } from 'src/cursos/curso.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Asistencia.name, schema: AsistenciaSchema },
      { name: Docente.name, schema: DocenteSchema },
      { name: Curso.name, schema: CursoSchema },
    ]),
  ],
  controllers: [ReportesController],
  providers: [ReportesService],
})
export class ReportesModule {}
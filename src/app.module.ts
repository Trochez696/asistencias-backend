import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocentesModule } from './docentes/docentes.module';
import { CursosModule } from './cursos/cursos.module';
import { AsistenciasModule } from './asistencias/asistencias.module';
import { ReportesModule } from './reportes/reportes.module';
import { AgendaModule } from './agenda/agenda.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://Proyecto_DS_II:5tGOjQkDhH67sf9t@cluster0.uux2ndk.mongodb.net/AsistenciasDB?retryWrites=true&w=majority&appName=Cluster0',
    ),
    DocentesModule,
    CursosModule,
    AsistenciasModule,
    ReportesModule,
    AgendaModule,
  ],
})
export class AppModule {}

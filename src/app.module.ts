import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { DocentesModule } from './docentes/docentes.module';
import { CursosModule } from './cursos/cursos.module';
import { AsistenciasModule } from './asistencias/asistencias.module';
import { ReportesModule } from './reportes/reportes.module';
import { AgendaModule } from './agenda/agenda.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI as string, {
      dbName: 'AsistenciasDB',
    }),
    DocentesModule,
    CursosModule,
    AsistenciasModule,
    ReportesModule,
    AgendaModule,
  ],
})
export class AppModule {}

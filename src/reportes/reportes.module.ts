import { Module } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Asistencia, AsistenciaSchema } from 'src/asistencias/asistencia.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Asistencia.name, schema: AsistenciaSchema }]),
  ],
  controllers: [ReportesController],
  providers: [ReportesService],
})
export class ReportesModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocentesService } from './docentes.service';
import { DocentesController } from './docentes.controller';
import { Docente, DocenteSchema } from './entities/docente.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Docente.name, schema: DocenteSchema }])],
  controllers: [DocentesController],
  providers: [DocentesService],
})
export class DocentesModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Agenda, AgendaSchema } from './agenda.schema';
import { AgendaService } from './agenda.service';
import { AgendaController } from './agenda.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Agenda.name, schema: AgendaSchema }])],
  controllers: [AgendaController],
  providers: [AgendaService],
})
export class AgendaModule {}

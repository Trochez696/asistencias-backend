import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'agendas', timestamps: true })
export class Agenda extends Document {
  @Prop({ required: true })
  cursoId: string;

  @Prop({ required: true })
  docenteId: string;

  @Prop({ required: true })
  nombreCurso: string;

  @Prop({ required: true })
  nombreDocente: string;

  @Prop({ required: true })
  diaSemana: string;

  @Prop({ required: true })
  horaInicio: string;

  @Prop({ required: true })
  horaFin: string;

  @Prop({ required: true })
  salon: string;
}

export const AgendaSchema = SchemaFactory.createForClass(Agenda);

AgendaSchema.index(
  { cursoId: 1, diaSemana: 1, horaInicio: 1, horaFin: 1 },
  { unique: true }
);

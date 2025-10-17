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
  diaSemana: string; // Ejemplo: "Lunes", "Martes", etc.

  @Prop({ required: true })
  horaInicio: string; // Ejemplo: "08:00"

  @Prop({ required: true })
  horaFin: string; // Ejemplo: "10:00"

  @Prop({ required: true })
  salon: string;
}

export const AgendaSchema = SchemaFactory.createForClass(Agenda);

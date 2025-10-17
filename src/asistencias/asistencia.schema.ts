import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Asistencia extends Document {
  @Prop({ required: true })
  docenteId: string;

  @Prop({ required: true })
  cursoId: string;

  @Prop({ required: true })
  fecha: Date;

  @Prop({ required: true, enum: ['Presente', 'Ausente', 'Tarde'] })
  estado: string;

  @Prop()
  observaciones?: string;

  @Prop({ required: true })
  horasDictadas: number;
}

export const AsistenciaSchema = SchemaFactory.createForClass(Asistencia);

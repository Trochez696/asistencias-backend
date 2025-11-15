// En asistencia.schema.ts - Asegúrate de que tenga estas referencias
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Asistencia extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Docente', required: true })
  docenteId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Curso', required: true })
  cursoId: Types.ObjectId;

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
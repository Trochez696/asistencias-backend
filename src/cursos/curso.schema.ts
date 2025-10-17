import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Curso extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true, unique: true })
  codigo: string;

  @Prop({ type: Types.ObjectId, ref: 'Docente', required: true })
  docenteId: Types.ObjectId;

  @Prop({ required: true })
  horario: string;

  @Prop({ required: true })
  semestre: string;

  @Prop()
  aula: string;
}

export const CursoSchema = SchemaFactory.createForClass(Curso);

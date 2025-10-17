import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'docentes', timestamps: true })
export class Docente extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true, unique: true })
  identificacion: string;

  @Prop({ required: true, unique: true })
  correo: string;

  @Prop({ required: true })
  asignatura: string;

  @Prop({ default: 0 })
  horasDictadas: number;
}

export const DocenteSchema = SchemaFactory.createForClass(Docente);

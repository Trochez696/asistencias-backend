import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Docente } from './entities/docente.entity';

@Injectable()
export class DocentesService {
  constructor(
    @InjectModel(Docente.name) private readonly docenteModel: Model<Docente>,
  ) {}

  async create(data: any): Promise<Docente> {
    const nuevoDocente = new this.docenteModel(data);
    return await nuevoDocente.save();
  }

  async findAll(): Promise<Docente[]> {
    return await this.docenteModel.find().exec();
  }

  async findOne(id: string): Promise<Docente> {
    const docente = await this.docenteModel.findById(id).exec();
    if (!docente) {
      throw new NotFoundException('Docente no encontrado');
    }
    return docente;
  }

  async update(id: string, data: any): Promise<Docente> {
    const docente = await this.docenteModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!docente) {
      throw new NotFoundException('Docente no encontrado');
    }
    return docente;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.docenteModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Docente no encontrado');
    }
    return { message: 'Docente eliminado correctamente' };
  }
}

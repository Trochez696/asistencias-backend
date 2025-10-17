import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Curso } from './curso.schema';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Injectable()
export class CursosService {
  constructor(@InjectModel(Curso.name) private cursoModel: Model<Curso>) {}

  async create(createCursoDto: CreateCursoDto): Promise<Curso> {
    const nuevo = new this.cursoModel(createCursoDto);
    return nuevo.save();
  }

  async findAll(): Promise<Curso[]> {
    return this.cursoModel.find().populate('docenteId', 'nombre email').exec();
  }

  async findOne(id: string): Promise<Curso | null> {
    return this.cursoModel.findById(id).populate('docenteId', 'nombre email').exec();
  }

  async update(id: string, updateCursoDto: UpdateCursoDto): Promise<Curso | null> {
    return this.cursoModel.findByIdAndUpdate(id, updateCursoDto, { new: true });
  }

  async remove(id: string): Promise<Curso | null> {
    return this.cursoModel.findByIdAndDelete(id);
  }
}

import { Controller, Post, Get, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AgendaService } from './agenda.service';

@Controller('agenda')
export class AgendaController {
  constructor(private readonly agendaService: AgendaService) {}

  // 📥 Importar archivo Excel
  @Post('importar')
  @UseInterceptors(FileInterceptor('file'))
  async importar(@UploadedFile() file: Express.Multer.File) {
    return this.agendaService.importarAgenda(file);
  }

  // 📄 Consultar agenda completa
  @Get()
  async obtenerAgenda() {
    return this.agendaService.obtenerAgenda();
  }
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://Proyecto_DS_II:5tGOjQkDhH67sf9t@cluster0.uux2ndk.mongodb.net/AsistenciasDB?retryWrites=true&w=majority&appName=Cluster0',
    ),
  ],
})
export class AppModule {}

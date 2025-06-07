import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { HttpModule } from '@nestjs/axios';
import { PokemonModule } from 'src/pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    HttpModule,
    PokemonModule
  ]
})
export class SeedModule {}

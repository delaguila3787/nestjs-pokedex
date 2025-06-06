import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

import { isValidObjectId, Model } from 'mongoose';


@Injectable()
export class PokemonService {

  constructor(

    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase()
    try
    {
      const pokemon = await this.pokemonModel.create( createPokemonDto )
      return pokemon;
    } catch (err) {
      this.handleExeptions( err )
    }

    
    
  }

  async findAll() {
    const pokemons = await this.pokemonModel.find()
    return pokemons;
  }

  async findOne(term: string) {
    let pokemon;

    //Busca por el NO
    if( !isNaN(+term) ){
      pokemon = await this.pokemonModel.findOne({no: term})
    }

    //Busca por el mongo ID

    if( !pokemon && isValidObjectId( term )){
      pokemon = await this.pokemonModel.findById( term )
    }

    //Busca por el nombre
    if( !pokemon ) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim()})
    }

    if( !pokemon ) throw new NotFoundException(`Pokemon with ID/NAME/NO "${ term }" not found`)

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    if( updatePokemonDto.name )
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    
    try {
      const pokemon: Pokemon = await this.findOne(term);

      await pokemon.updateOne( updatePokemonDto, { new: true})

      return { ...pokemon.toJSON(), ...updatePokemonDto};

    } catch (err) {

      this.handleExeptions(err)
    }
  
  }

  async remove( id: string ) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id})

    if( deletedCount === 0 ) throw new BadRequestException(`Pokemon with ID "${ id }" not found`)

    return;
  }


  private handleExeptions( err: any) {
    if(err.code === 11000) throw new BadRequestException(` Pokemon already exist in DB ${ JSON.stringify( err.keyValue )} `)
      
      console.log(err)
      throw new InternalServerErrorException('cant create new pokemon check server logs')
  }
}

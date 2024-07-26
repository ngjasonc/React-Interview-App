import axios from 'axios'
import { PokemonInterface } from './types'

const POKEMON_API_BASE = 'https://pokeapi.co/api/v2/pokemon/'
const MOVE_API_BASE = 'https://pokeapi.co/api/v2/move/'
const MAX_POKEMON_INDEX = 151
const INDEX_OF_ENGLISH_MOVE_NAME = 7

function getRandomPokemonUrl() {
  return POKEMON_API_BASE + Math.ceil(Math.random() * MAX_POKEMON_INDEX)
}

function getPokemonMoveUrl(move: string) {
  return MOVE_API_BASE + move
}

function capitalize(word: string){
  return word.charAt(0).toUpperCase() + word.slice(1)
}

async function parsedPokemon(data: any) {
  // Get random move
  const nMoves: number = data.moves.length
  const randomMove = data.moves[Math.floor(Math.random()*nMoves)]
  const moveNameVariable: string = randomMove.move.name
  
  const moveResponse = await axios.get(getPokemonMoveUrl(moveNameVariable))
  const moveName: string = moveResponse.data.names[INDEX_OF_ENGLISH_MOVE_NAME].name
  const movePower: number = moveResponse.data.power || 0

  const pokemon:PokemonInterface = {
    name: capitalize(data.name),
    moveName: moveName,
    movePower: movePower,
    frontSpriteUrl: data.sprites.front_default,
    backSpriteUrl: data.sprites.back_default
  }

  return pokemon
}

export default async function fetchPokemon() {
  try {
    const response = await axios.get(getRandomPokemonUrl())
    const pokemon = await parsedPokemon(response.data)
    
    return pokemon
  } catch (error) {
    console.error(error)
  }
}
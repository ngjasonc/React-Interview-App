import { useEffect, useState } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import axios from 'axios';

const POKEMON_API_BASE = 'https://pokeapi.co/api/v2/pokemon/'
const MOVE_API_BASE = 'https://pokeapi.co/api/v2/move/'
const MAX_POKEMON_INDEX = 151
const INDEX_OF_ENGLISH_MOVE_NAME = 7

interface Pokemon {
  name: string;
  moveName: string;
  movePower: number;
  frontSpriteUrl: string;
  backSpriteUrl: string;
}

interface InfoBarProps {
  name: string;
  moveName: string;
  movePower: number;
}

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

  const pokemon:Pokemon = {
    name: capitalize(data.name),
    moveName: moveName,
    movePower: movePower,
    frontSpriteUrl: data.sprites.front_default,
    backSpriteUrl: data.sprites.back_default
  }

  return pokemon
}

function MoveStat({label}: {label: string}) {
  return (
    <div className="Move-stat">
      {label}
    </div>
  )
}

function InfoBar({name, moveName, movePower}: InfoBarProps) {
  const moveDesc: string = `${moveName}: ${movePower}`

  return (
    <div className="Info-bar">
        <div className="col-xs-7">
          {name}
        </div>
        <div className="col-xs-5">
          <MoveStat label={moveDesc}/>
        </div>
    </div>
  )
}

function PokeSprite({spriteUrl, name}: {spriteUrl: string, name: string}) {
  return (
    <div className="Poke-sprite">
      <img
        src={spriteUrl}
        alt={name}
      />
    </div>
  )
}

function BattleScreen({pokemonTop, pokemonBot}: {pokemonTop: Pokemon, pokemonBot: Pokemon}) {

  return (
    <div className="Battle-screen">
      <div className="container">
        <div className="row">
          <div className="col-xs-9">
            <InfoBar name={pokemonTop.name} moveName={pokemonTop.moveName} movePower={pokemonTop.movePower} />
          </div>
          <div className="col-xs-3">
            <PokeSprite spriteUrl={pokemonTop.frontSpriteUrl} name={pokemonTop.name}/>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-3">
            <PokeSprite spriteUrl={pokemonBot.backSpriteUrl} name={pokemonBot.name}/>
          </div>
          {/* <div className="col-xs-2"></div> */}
          <div className="col-xs-9">
            <InfoBar name={pokemonBot.name} moveName={pokemonBot.moveName} movePower={pokemonBot.movePower} />
          </div>
        </div>
      </div>
    </div>
  )
}

function BattleLog({message}: {message: string}) {
  return (
    <div className="Battle-log">
      {message}
    </div>
  )
}

function StartButton({onBattleStartClick}: {onBattleStartClick: (e: React.MouseEvent<HTMLElement>) => void}) {
  return (
    <button type="button" className="Start-button" onClick={onBattleStartClick}>
      Start Battle!
    </button>
  )
}

function composeLogMessage(pokemonTop: Pokemon, pokemonBot: Pokemon, battleStart: boolean) {
  if (!battleStart) {
    return ''
  }

  if (pokemonTop.movePower === pokemonBot.movePower) {
    return 'Draw'
  }

  if (pokemonTop.movePower > pokemonBot.movePower) {
    return `${pokemonTop.name} lands a decisive blow with ${pokemonTop.moveName} knocking out ${pokemonBot.name}!`
  }
  return `${pokemonBot.name} lands a decisive blow with ${pokemonBot.moveName} knocking out ${pokemonTop.name}!`
}

function App() {
  const [pokemonTop, setPokemonTop] = useState<Pokemon>()
  const [pokemonBot, setPokemonBot] = useState<Pokemon>()
  const [ready, setReady] = useState(false)
  const [battleStart, setBattleStart] = useState(false)

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response1 = await axios.get(getRandomPokemonUrl())
        const response2 = await axios.get(getRandomPokemonUrl())

        const pokemonTop = await parsedPokemon(response1.data)
        const pokemonBot = await parsedPokemon(response2.data)
        
        setPokemonTop(pokemonTop)
        setPokemonBot(pokemonBot)
        setReady(true)
      } catch (error) {
        console.error(error)
      }
    }

    fetchPokemon();
  }, []);

  const logMessage = composeLogMessage(pokemonTop as Pokemon, pokemonBot as Pokemon, battleStart)

  return (
    <div className="App">
      <div className="App-header">
        { ready &&
          <div className="container-fluid text-left">
            <div className="row">
              <div className="col">
                <BattleScreen pokemonTop={pokemonTop as Pokemon} pokemonBot={pokemonBot as Pokemon} />
              </div>
            </div>
            <div className="row">
              Battle Log
            </div>
            <div className="row">
              <div className="col-xs-8">
                <BattleLog message={logMessage}/>
              </div>
              <div className="col-xs-4">
                <StartButton onBattleStartClick={() => setBattleStart(true)}/>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
}

export default App;

import { useEffect, useState } from 'react'

import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'

import { PokemonInterface } from './types'
import BattleScreen from './BattleScreen'
import BattleLog from './BattleLog'
import StartButton from './StartButton'
import fetchPokemon from './pokemonApiInterface'


function composeLogMessage(pokemonTop: PokemonInterface, pokemonBot: PokemonInterface, battleStart: boolean) {
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
  const [pokemonTop, setPokemonTop] = useState<PokemonInterface>()
  const [pokemonBot, setPokemonBot] = useState<PokemonInterface>()
  const [ready, setReady] = useState(false)
  const [battleStart, setBattleStart] = useState(false)

  useEffect(() => {
    Promise.all<Array<Promise<PokemonInterface | undefined>>>([
      fetchPokemon(),
      fetchPokemon()
    ])
    .then(pokemon => {
      setPokemonTop(pokemon[0])
      setPokemonBot(pokemon[1])
      setReady(true)
    })
  }, [])

  const logMessage = composeLogMessage(pokemonTop as PokemonInterface, pokemonBot as PokemonInterface, battleStart)

  return (
    <div className="App">
      <div className="App-header">
        { ready &&
          <div className="container-fluid text-left">
            <div className="row">
              <div className="col">
                <BattleScreen pokemonTop={pokemonTop as PokemonInterface} pokemonBot={pokemonBot as PokemonInterface} />
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
  )
}

export default App

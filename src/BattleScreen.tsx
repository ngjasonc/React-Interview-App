import { PokemonInterface } from './types' 

interface InfoBarProps {
  name: string;
  moveName: string;
  movePower: number;
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

function BattleScreen({pokemonTop, pokemonBot}: {pokemonTop: PokemonInterface, pokemonBot: PokemonInterface}) {
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
          <div className="col-xs-9">
            <InfoBar name={pokemonBot.name} moveName={pokemonBot.moveName} movePower={pokemonBot.movePower} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BattleScreen
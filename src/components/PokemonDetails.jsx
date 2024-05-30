import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { typeColors } from './PokemonPreview'; // Importa typeColors desde PokemonPreview
import LoadingSpinner from './LoadingSpinner'; // Importa el componente LoadingSpinner

const typeEffectiveness = {
  normal: { weakTo: ['fighting'], resistantTo: ['ghost'] },
  fire: { weakTo: ['water', 'rock', 'ground'], resistantTo: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'] },
  water: { weakTo: ['electric', 'grass'], resistantTo: ['fire', 'water', 'ice', 'steel'] },
  // Añadir todos los tipos...
};

const statColors = {
  hp: 'bg-red-500',
  attack: 'bg-orange-500',
  defense: 'bg-yellow-500',
  'special-attack': 'bg-green-500',
  'special-defense': 'bg-blue-500',
  speed: 'bg-purple-500',
};

const evolutionStonesList = [
  'fire-stone',
  'water-stone',
  'thunder-stone',
  'leaf-stone',
  'moon-stone',
  'sun-stone',
  'dusk-stone',
  'dawn-stone',
  'shiny-stone',
  'ice-stone',
];

const fetchEvolutionChain = async (url) => {
  const response = await axios.get(url);
  return response.data.chain;
};

const getEvolutionStonesFromChain = (evolutionChain) => {
  const evolutionStones = new Set();

  const traverseChain = (chain) => {
    if (chain.evolves_to.length) {
      chain.evolves_to.forEach((evolution) => {
        if (evolution.evolution_details.length) {
          evolution.evolution_details.forEach((detail) => {
            if (evolutionStonesList.includes(detail.item?.name)) {
              evolutionStones.add(detail.item.name);
            }
          });
        }
        traverseChain(evolution);
      });
    }
  };

  traverseChain(evolutionChain);
  return Array.from(evolutionStones);
};

const getTypeEffectiveness = (types) => {
  const weaknesses = [];
  const resistances = [];
  types.forEach(({ type }) => {
    const typeData = typeEffectiveness[type.name];
    if (typeData) {
      weaknesses.push(...typeData.weakTo);
      resistances.push(...typeData.resistantTo);
    }
  });
  return { weaknesses: [...new Set(weaknesses)], resistances: [...new Set(resistances)] };
};

const PokemonDetails = ({ pokemon }) => {
  const [description, setDescription] = useState('');
  const [evolutions, setEvolutions] = useState([]);
  const [evolutionStones, setEvolutionStones] = useState([]);
  const [captureLocations, setCaptureLocations] = useState([]);
  const [levelUpMoves, setLevelUpMoves] = useState([]);
  const [tmMoves, setTmMoves] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [showLevelUpMoves, setShowLevelUpMoves] = useState(false);
  const [showTmMoves, setShowTmMoves] = useState(false);
  const [showCaptureLocations, setShowCaptureLocations] = useState(false);

  useEffect(() => {
    const fetchPokemonData = async () => {
      if (pokemon && pokemon.species) {
        setLoading(true); // Inicia la carga
        try {
          const speciesResponse = await axios.get(pokemon.species.url);
          const { evolution_chain, flavor_text_entries } = speciesResponse.data;

          // Obtener la descripción en inglés
          const englishText = flavor_text_entries.find(entry => entry.language.name === 'en');
          if (englishText) {
            setDescription(englishText.flavor_text.replace(/(\r\n|\n|\r)/gm, ' ')); // Elimina saltos de línea
          }

          if (evolution_chain) {
            const chain = await fetchEvolutionChain(evolution_chain.url);
            const fetchEvolutionsRecursive = async (evolutionChain) => {
              let evolutionsList = [];
              if (evolutionChain.species) {
                const speciesResponse = await axios.get(evolutionChain.species.url);
                const speciesData = speciesResponse.data;
                const id = speciesData.id;
                evolutionsList.push({ name: speciesData.name, id });
              }
              if (evolutionChain.evolves_to && evolutionChain.evolves_to.length > 0) {
                for (const evolution of evolutionChain.evolves_to) {
                  const subEvolutions = await fetchEvolutionsRecursive(evolution);
                  evolutionsList = evolutionsList.concat(subEvolutions);
                }
              }
              return evolutionsList;
            };

            const evolutionsList = await fetchEvolutionsRecursive(chain);
            setEvolutions(evolutionsList);
            const stones = getEvolutionStonesFromChain(chain);
            setEvolutionStones(stones);
          }

          const locationsResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}/encounters`);
          setCaptureLocations(locationsResponse.data);

          const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`);
          const moves = response.data.moves;

          const levelUp = new Map();
          const tm = new Set();

          moves.forEach(move => {
            move.version_group_details.forEach(detail => {
              if (detail.move_learn_method.name === 'level-up') {
                if (!levelUp.has(move.move.name) || detail.level_learned_at < levelUp.get(move.move.name)) {
                  levelUp.set(move.move.name, detail.level_learned_at);
                }
              } else if (detail.move_learn_method.name === 'machine') {
                tm.add(move.move.name);
              }
            });
          });

          setLevelUpMoves(Array.from(levelUp.entries()).sort((a, b) => a[1] - b[1]).map(([move, level]) => ({ move, level })));
          setTmMoves(Array.from(tm));
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false); // Finaliza la carga
        }
      }
    };

    fetchPokemonData();
  }, [pokemon]);

  if (loading) {
    return <LoadingSpinner />; // Muestra el spinner mientras los datos están siendo cargados
  }

  if (!pokemon) {
    return <div>No Pokémon selected</div>;
  }

  const { name, height, weight, abilities, types, stats, id } = pokemon;
  const { weaknesses, resistances } = getTypeEffectiveness(types);

  return (
    <div className="pokemon-details relative bg-gray-200 p-6 rounded-lg shadow-lg text-center w-full h-full overflow-auto">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url(https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png)`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
      <div className="relative flex flex-col items-center">
        <div className="flex flex-col items-center">
          <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`} alt={name} className="mx-auto w-32 h-32 mb-4" />
          <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/${id}.gif`} alt={`${name} shiny`} className="mx-auto w-32 h-32 mb-4" />
          <p className="text-sm text-gray-500">{`N° ${id}`}</p>
          <h2 className="text-2xl font-bold mt-2 mb-4">{name.charAt(0).toUpperCase() + name.slice(1)}</h2>
        </div>
        <div className="mb-4">
          <p className="text-lg"><strong>Height:</strong> {height / 10} m</p>
          <p className="text-lg"><strong>Weight:</strong> {weight / 10} kg</p>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Description</h3>
          <p>{description}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Abilities</h3>
          <ul>
            {abilities.map((ability, index) => (
              <li key={index} className="capitalize">{ability.ability.name.replace(/-/g, ' ')}</li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Type</h3>
          <div className="flex justify-center">
            {types.map((type, index) => (
              <span key={index} className={`px-4 py-2 m-1 rounded text-white ${typeColors[type.type.name]}`}>
                {type.type.name}
              </span>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Base Stats</h3>
          <ul>
            {stats.map((stat, index) => (
              <li key={index} className="flex items-center justify-between mb-2">
                <span className="capitalize">{stat.stat.name.replace(/-/g, ' ')}</span>
                <div className="w-full h-2 bg-gray-300 mx-4 rounded">
                  <div
                    className={`h-2 rounded ${statColors[stat.stat.name]}`}
                    style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                  ></div>
                </div>
                <span>{stat.base_stat}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Type Effectiveness</h3>
          <div className="flex flex-wrap justify-center">
            <div className="w-full md:w-1/2 px-2">
              <h4 className="text-lg font-semibold mb-2">Weaknesses</h4>
              {weaknesses.length ? (
                <ul className="flex flex-wrap justify-center">
                  {weaknesses.map((weakness, index) => (
                    <li key={index} className={`px-4 py-2 m-1 rounded text-white ${typeColors[weakness]}`}>
                      {weakness}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>None</p>
              )}
            </div>
            <div className="w-full md:w-1/2 px-2">
              <h4 className="text-lg font-semibold mb-2">Resistances</h4>
              {resistances.length ? (
                <ul className="flex flex-wrap justify-center">
                  {resistances.map((resistance, index) => (
                    <li key={index} className={`px-4 py-2 m-1 rounded text-white ${typeColors[resistance]}`}>
                      {resistance}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>None</p>
              )}
            </div>
          </div>
        </div>
        {evolutions.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Evolutions</h3>
            <ul className="flex justify-center">
              {evolutions.map((evolution, index) => (
                <li key={index} className="flex flex-col items-center capitalize mx-2">
                  <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolution.id}.png`} alt={evolution.name} className="w-16 h-16 mb-2" />
                  {evolution.name}
                </li>
              ))}
            </ul>
          </div>
        )}
        {evolutionStones.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Evolution Stones</h3>
            <ul>
              {evolutionStones.map((stone, index) => (
                <li key={index} className="capitalize">{stone.replace(/-/g, ' ')}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setShowCaptureLocations(!showCaptureLocations)}
          >
            {showCaptureLocations ? 'Hide' : 'Show'} Capture Locations
          </button>
          {showCaptureLocations && (
            <ul>
              {captureLocations.map((location, index) => (
                <li key={index} className="capitalize">{location.location_area.name.replace(/-/g, ' ')}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setShowLevelUpMoves(!showLevelUpMoves)}
          >
            {showLevelUpMoves ? 'Hide' : 'Show'} Level-Up Moves
          </button>
          {showLevelUpMoves && (
            <ul>
              {levelUpMoves.map((move, index) => (
                <li key={index} className="capitalize">{`${move.move} - Level ${move.level}`}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setShowTmMoves(!showTmMoves)}
          >
            {showTmMoves ? 'Hide' : 'Show'} TM Moves
          </button>
          {showTmMoves && (
            <ul>
              {tmMoves.map((move, index) => (
                <li key={index} className="capitalize">{move}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

PokemonDetails.propTypes = {
  pokemon: PropTypes.object,
};

export default PokemonDetails;

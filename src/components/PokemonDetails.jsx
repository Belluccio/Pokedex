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

  const fetchMoves = async (pokemonId) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
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
      console.error('Error fetching moves:', error);
    }
  };

  useEffect(() => {
    if (pokemon && pokemon.species) {
      setLoading(true); // Inicia la carga
      const fetchEvolutionDetails = async () => {
        try {
          const response = await axios.get(pokemon.species.url);
          const { evolution_chain, flavor_text_entries } = response.data;

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
        } catch (error) {
          console.error('Error fetching evolution details:', error);
        } finally {
          setLoading(false); // Finaliza la carga
        }
      };

      fetchEvolutionDetails();
    }
  }, [pokemon]);

  useEffect(() => {
    if (pokemon) {
      const fetchCaptureLocations = async () => {
        try {
          const locationsResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}/encounters`);
          setCaptureLocations(locationsResponse.data);
        } catch (error) {
          console.error('Error fetching capture locations:', error);
        }
      };

      fetchCaptureLocations();
      fetchMoves(pokemon.id);
    }
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
          <p className="text-sm text-gray-500">{`N° ${id}`}</p>
          <h2 className="text-2xl font-bold mt-2 mb-4">{name.charAt(0).toUpperCase() + name.slice(1)}</h2>
        </div>
        <div className="flex flex-col items-center mt-4">
          <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`} alt={`Shiny ${name}`} className="mx-auto w-32 h-32 mb-4" />
          <p className="text-sm text-gray-500">{`Shiny ${name.charAt(0).toUpperCase() + name.slice(1)}`}</p>
        </div>
        <div className="mb-4">
          <p className="text-lg"><strong>Height:</strong> {height / 10} m</p>
          <p className="text-lg"><strong>Weight:</strong> {weight / 10} kg</p>
        </div>
        {description && (
          <p className="text-lg mt-2"><strong>Description:</strong> {description}</p>
        )}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Stats</h3>
          <div className="grid grid-cols-6 gap-2 justify-center">
            {stats.map((stat) => (
              <div key={stat.stat.name} className={`px-2 py-1 rounded-full text-sm text-white ${statColors[stat.stat.name] || 'bg-gray-300'}`}>
                {stat.base_stat}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-6 gap-2 justify-center mt-1">
            <span className="text-sm">Hp</span>
            <span className="text-sm">Atk</span>
            <span className="text-sm">Def</span>
            <span className="text-sm">SpA</span>
            <span className="text-sm">SpD</span>
            <span className="text-sm">Spe</span>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Abilities</h3>
          <ul className="flex flex-wrap justify-center space-x-2">
            {abilities.map((ability, index) => (
              <li key={index} className="bg-gray-300 rounded-full px-3 py-1 text-sm">
                {ability.ability.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Types</h3>
          <div className="flex justify-center space-x-2">
            {types.map((type, index) => (
              <span key={index} className={`text-white px-3 py-1 rounded-full ${typeColors[type.type.name]}`}>
                {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Weaknesses</h3>
          <div className="flex flex-wrap justify-center space-x-2">
            {weaknesses.map((weakness, index) => (
              <span key={index} className={`${typeColors[weakness]} text-white px-2 py-1 rounded-full text-sm`}>
                {weakness.charAt(0).toUpperCase() + weakness.slice(1)}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Resistances</h3>
          <div className="flex flex-wrap justify-center space-x-2">
            {resistances.map((resistance, index) => (
              <span key={index} className={`${typeColors[resistance]} text-white px-2 py-1 rounded-full text-sm`}>
                {resistance.charAt(0).toUpperCase() + resistance.slice(1)}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Evolutions</h3>
          <ul className="flex flex-wrap justify-center space-x-2">
            {evolutions.map((evolution) => (
              <li key={evolution.id} className="flex flex-col items-center">
                <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution.id}.png`} alt={evolution.name} className="w-8 h-8 mb-1" />
                <span className="bg-gray-300 rounded-full px-3 py-1 text-sm">
                  {evolution.name.charAt(0).toUpperCase() + evolution.name.slice(1)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Evolution Stones</h3>
          <ul className="flex flex-wrap justify-center space-x-2">
            {evolutionStones.map((stone) => (
              <li key={stone} className="bg-gray-300 rounded-full px-3 py-1 text-sm">
                {stone.charAt(0).toUpperCase() + stone.slice(1).replace('-', ' ')}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 cursor-pointer flex justify-between items-center" onClick={() => setShowLevelUpMoves(!showLevelUpMoves)}>
            Moves Learned by Level Up <span>{showLevelUpMoves ? '▲' : '▼'}</span>
          </h3>
          {showLevelUpMoves && (
            <ul className="flex flex-wrap justify-center space-x-2">
              {levelUpMoves.map((move, index) => (
                <li key={index} className="bg-gray-300 rounded-full px-3 py-1 text-sm">
                  {`${move.move.charAt(0).toUpperCase() + move.move.slice(1)} (Lvl ${move.level})`}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 cursor-pointer flex justify-between items-center" onClick={() => setShowTmMoves(!showTmMoves)}>
            Moves Learned by TM <span>{showTmMoves ? '▲' : '▼'}</span>
          </h3>
          {showTmMoves && (
            <ul className="flex flex-wrap justify-center space-x-2">
              {tmMoves.map((move, index) => (
                <li key={index} className="bg-gray-300 rounded-full px-3 py-1 text-sm">
                  {move.charAt(0).toUpperCase() + move.slice(1)}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 cursor-pointer flex justify-between items-center" onClick={() => setShowCaptureLocations(!showCaptureLocations)}>
            Capture Locations <span>{showCaptureLocations ? '▲' : '▼'}</span>
          </h3>
          {showCaptureLocations && (
            <ul className="flex flex-wrap justify-center space-x-2">
              {captureLocations.map((location) => (
                <li key={location.location_area.name} className="bg-gray-300 rounded-full px-3 py-1 text-sm">
                  {location.location_area.name.charAt(0).toUpperCase() + location.location_area.name.slice(1)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

PokemonDetails.propTypes = {
  pokemon: PropTypes.object.isRequired,
};

export default PokemonDetails;

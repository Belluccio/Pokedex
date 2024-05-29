import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { typeColors } from './PokemonPreview'; // Importa typeColors desde PokemonPreview

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

const PokemonDetails = ({ pokemon }) => {
  const [evolutionNames, setEvolutionNames] = useState([]);

  useEffect(() => {
    if (pokemon && pokemon.species) {
      const fetchEvolutionNames = async () => {
        try {
          const response = await axios.get(pokemon.species.url);
          const { evolves_from_species, evolution_chain } = response.data;
          if (evolves_from_species) {
            const evolvesFromResponse = await axios.get(evolves_from_species.url);
            const evolvesFromData = evolvesFromResponse.data;
            if (evolvesFromData && evolvesFromData.varieties && evolvesFromData.varieties.length > 0) {
              const evolvesFromPokemon = evolvesFromData.varieties[0].pokemon;
              setEvolutionNames((prevNames) => [...prevNames, evolvesFromPokemon.name]);
            }
          }
          if (evolution_chain) {
            const chainResponse = await axios.get(evolution_chain.url);
            const { chain } = chainResponse.data;
            const fetchEvolutionNamesRecursive = (evolutionChain) => {
              if (evolutionChain.species) {
                const speciesName = evolutionChain.species.name;
                setEvolutionNames((prevNames) => [...prevNames, speciesName]);
              }
              if (evolutionChain.evolves_to && evolutionChain.evolves_to.length > 0) {
                evolutionChain.evolves_to.forEach(evolution => {
                  fetchEvolutionNamesRecursive(evolution);
                });
              }
            };
            fetchEvolutionNamesRecursive(chain);
          }
        } catch (error) {
          console.error('Error fetching evolution names:', error);
        }
      };

      fetchEvolutionNames();
    }
  }, [pokemon]);

  if (!pokemon) {
    return <div>No Pokémon selected</div>;
  }

  const { name, height, weight, abilities, types, stats, id } = pokemon;
  const { weaknesses, resistances } = getTypeEffectiveness(types);

  return (
    <div className="pokemon-details bg-gray-200 p-6 rounded-lg shadow-lg text-center">
      <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`} alt={name} className="mx-auto w-32 h-32 mb-4" />
      <p className="text-sm text-gray-500">#{id.toString().padStart(3, '0')}</p>
      <h2 className="text-2xl font-bold mt-2 mb-4">{name.charAt(0).toUpperCase() + name.slice(1)}</h2>
      <div className="mb-4 flex justify-center space-x-4">
        <p className="text-sm"><span className="font-semibold">Height:</span> {height / 10} m</p>
        <p className="text-sm"><span className="font-semibold">Weight:</span> {weight / 10} kg</p>
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Abilities</h3>
        <ul className="flex flex-wrap justify-center space-x-2">
          {abilities.map((ability, index) => (
            <li key={index} className="bg-gray-300 rounded-full px-3 py-1 text-sm">
              {ability.ability.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Types</h3>
        <div className="flex justify-center space-x-2">
          {types.map((type, index) => (
            <span key={index} className={`text-white px-3 py-1 rounded-full ${typeColors[type.type.name]}`}>
              {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Weaknesses</h3>
        <div className="flex flex-wrap justify-center space-x-2">
          {weaknesses.map((weakness, index) => (
            <span key={index} className={`${typeColors[weakness]} text-white px-2 py-1 rounded-full text-sm`}>
              {weakness.charAt(0).toUpperCase() + weakness.slice(1)}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Resistances</h3>
        <div className="flex flex-wrap justify-center space-x-2">
          {resistances.map((resistance, index) => (
            <span key={index} className={`${typeColors[resistance]} text-white px-2 py-1 rounded-full text-sm`}>
              {resistance.charAt(0).toUpperCase() + resistance.slice(1)}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Evolutions</h3>
        <ul className="flex flex-wrap justify-center space-x-2">
          {evolutionNames.map((evolution, index) => (
            <li key={index} className="bg-gray-300 rounded-full px-3 py-1 text-sm">
              {evolution.charAt(0).toUpperCase() + evolution.slice(1)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

PokemonDetails.propTypes = {
  pokemon: PropTypes.object.isRequired,
};

export default PokemonDetails;

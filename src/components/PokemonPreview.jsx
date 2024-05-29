import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const PokemonPreview = ({ pokemon, onClick }) => {
  const [pokemonData, setPokemonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(pokemon.url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setPokemonData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching the Pokemon data:', error);
        setError(error);
        setLoading(false);
      });
  }, [pokemon.url]);

  const handlePokemonClick = () => {
    onClick(pokemonData); // Pasa los datos del Pokémon al manejar el clic
  };

  if (loading) {
    return <div className="pokemon-container bg-white p-4 rounded-lg text-center shadow-md">Loading...</div>;
  }

  if (error) {
    return <div className="pokemon-container bg-red-500 text-white p-4 rounded-lg text-center shadow-md">Error loading data: {error.message}</div>;
  }

  const types = pokemonData.types.map(type => type.type.name);

  return (
    <div className="pokemon-container bg-white p-4 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={handlePokemonClick}>
      <img
        src={pokemonData.sprites.front_default}
        alt={pokemonData.name}
        className="mx-auto mb-2 rounded-full overflow-hidden"
        style={{ maxHeight: '100px' }}
      />
      <p className="text-xs font-bold mb-1">{`N° ${parseInt(pokemonData.id, 10)}`}</p>
      <p className="font-outfit text-lg font-semibold mb-2">{pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</p>
      <div className="flex justify-center">
        {types.map((type, index) => (
          <span key={index} className={`text-white px-3 py-1 rounded-full m-1 ${typeColors[type]}`}> {/* Aquí usamos typeColors */}
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        ))}
      </div>
    </div>
  );
};

PokemonPreview.propTypes = {
  pokemon: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default PokemonPreview;

// Exporta typeColors para que pueda ser importado en otros componentes
export const typeColors = {
  'grass': 'bg-green-500',
  'poison': 'bg-purple-600',
  'fire': 'bg-red-500',
  'water': 'bg-blue-500',
  'bug': 'bg-yellow-500',
  'normal': 'bg-gray-500',
  'electric': 'bg-yellow-400',
  'ground': 'bg-yellow-900',
  'fairy': 'bg-pink-300',
  'fighting': 'bg-red-700',
  'flying': 'bg-blue-400',
  'psychic': 'bg-purple-400',
  'rock': 'bg-gray-700',
  'ghost': 'bg-purple-800',
  'dragon': 'bg-indigo-800',
  'dark': 'bg-gray-900',
  'ice': 'bg-blue-300',
  'steel': 'bg-gray-600', //
};

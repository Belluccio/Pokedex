import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const PokemonPreview = ({ pokemon }) => {
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

  if (loading) {
    return <div className="bg-white p-2 rounded-lg text-center">Loading...</div>;
  }

  if (error) {
    return <div className="bg-red-500 text-white p-2 rounded-lg text-center">Error loading data: {error.message}</div>;
  }

  const types = pokemonData.types.map(type => type.type.name);
  const backgroundColors = {
    'grass': 'bg-green-500',
    'poison': 'bg-purple-500',
    'fire': 'bg-red-500',
    'water': 'bg-blue-500',
    'bug': 'bg-yellow-500',
    'normal': 'bg-pink-500',
    'electric': 'bg-yellow-500',
    'ground': 'bg-brown-500',
    'fairy': 'bg-pink-300',
    'fighting': 'bg-red-700',
    'flying': 'bg-orange-700',
    'psychic': 'bg-green-400',
    'rock': 'bg-gray-500', // Tipo roca (gris)
    'ghost': 'bg-purple-800', // Tipo fantasma (morado oscuro)
    'dragon': 'bg-black', // Tipo dragón (negro)
    'dark': 'bg-black', // Tipo siniestro (negro)
    'ice': 'bg-blue-200', // Tipo hielo (azul claro)
  };

  

  return (
    <div className="bg-white p-2 rounded-lg text-center">
      <img src={pokemonData.sprites.front_default} alt={pokemonData.name} className="mx-auto -mt-4 mb-2" style={{ maxHeight: '80px' }} />
      <p className="text-xs font-bold mb-1">{`#${pokemonData.id}`}</p>
      <p className="capitalize text-sm mb-2">{pokemonData.name}</p>
      <div className="flex justify-center">
        {types.map((type, index) => (
          <span key={index} className={`text-white px-2 py-1 rounded m-1 ${backgroundColors[type]} text-xs`}>
            {type}
          </span>
        ))}
      </div>
    </div>
  );
};

PokemonPreview.propTypes = {
  pokemon: PropTypes.object.isRequired,
};

export default PokemonPreview;

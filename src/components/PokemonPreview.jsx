import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const PokemonPreview = ({ pokemonURL }) => {
  const [pokemonData, setPokemonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(pokemonURL)
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
  }, [pokemonURL]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  return (
    <div>
      <h3>{pokemonData.name}</h3>
      <img src={pokemonData.sprites.front_default} alt={pokemonData.name} />
    </div>
  );
};

PokemonPreview.propTypes = {
  pokemonURL: PropTypes.string.isRequired,
};

export default PokemonPreview;

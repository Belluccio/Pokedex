import React from 'react';
import PropTypes from 'prop-types';

const PokemonDetails = ({ pokemon }) => {
  if (!pokemon) {
    return <div>No pokemon selected</div>;
  }

  const { name, sprites, height, weight, abilities, types } = pokemon;

  return (
    <div className="pokemon-details">
      <h2 className="text-xl font-bold mb-4">{name.charAt(0).toUpperCase() + name.slice(1)}</h2>
      <img src={sprites.front_default} alt={name} className="mx-auto mb-4" />
      <p className="mb-2">Height: {height} dm</p>
      <p className="mb-4">Weight: {weight} hg</p>
      <h3 className="text-lg font-semibold mb-2">Abilities</h3>
      <ul className="list-disc list-inside mb-4">
        {abilities.map((ability, index) => (
          <li key={index}>{ability.ability.name}</li>
        ))}
      </ul>
      <h3 className="text-lg font-semibold mb-2">Types</h3>
      <ul className="list-disc list-inside">
        {types.map((type, index) => (
          <li key={index}>{type.type.name}</li>
        ))}
      </ul>
    </div>
  );
};

PokemonDetails.propTypes = {
  pokemon: PropTypes.object
};

export default PokemonDetails;

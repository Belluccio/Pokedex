import React from 'react';

const PokemonDetails = ({ pokemon }) => {
  if (!pokemon) {
    return <div>No pokemon selected</div>;
  }

  const { name, sprites, height, weight, abilities, types } = pokemon;

  return (
    <div className="pokemon-details">
      <h2>{name}</h2>
      <img src={sprites.front_default} alt={name} />
      <p>Height: {height} dm</p>
      <p>Weight: {weight} hg</p>
      <h3>Abilities</h3>
      <ul>
        {abilities.map((ability, index) => (
          <li key={index}>{ability.ability.name}</li>
        ))}
      </ul>
      <h3>Types</h3>
      <ul>
        {types.map((type, index) => (
          <li key={index}>{type.type.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default PokemonDetails;

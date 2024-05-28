import React from 'react';
import PropTypes from 'prop-types';
import PokemonPreview from './PokemonPreview';

const PokemonList = ({ pokemons, onClick }) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
      {pokemons.map((pokemon, index) => (
        <PokemonPreview key={index} pokemon={pokemon} onClick={onClick} />
      ))}
    </section>
  );
};

PokemonList.propTypes = {
  pokemons: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default PokemonList;

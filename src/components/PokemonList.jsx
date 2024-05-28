import React from 'react';
import PropTypes from 'prop-types';
import PokemonPreview from './PokemonPreview';

const PokemonList = ({ pokemons }) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
      {pokemons.map((pokemon) => (
        <PokemonPreview key={pokemon.url} pokemon={pokemon} />
      ))}
    </section>
  );
};

PokemonList.propTypes = {
  pokemons: PropTypes.array.isRequired,
};

export default PokemonList;

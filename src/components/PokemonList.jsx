import React from 'react';
import PropTypes from 'prop-types';
import PokemonPreview from './PokemonPreview';

// Componente que recibe la lista de Pokémons y renderiza cada uno
const PokemonList = ({ pokemons }) => {
  return (
    <section>
      {pokemons.map((pokemon) => {
        console.log(pokemon); // Verificar la estructura del objeto pokemon
        return <PokemonPreview key={pokemon.url} pokemonURL={pokemon.url} />;
      })}
    </section>
  );
};

PokemonList.propTypes = {
  pokemons: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default PokemonList;

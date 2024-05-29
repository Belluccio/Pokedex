import React from "react";
import PokemonDetails from "./PokemonDetails";
import PropTypes from 'prop-types';

const Aside = ({ pokemons }) => {
  return (
    <aside className="bg-gray-200 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Pokemon Details</h2>
      {pokemons.length > 0 ? (
        pokemons.map(pokemon => <PokemonDetails key={pokemon.id} pokemon={pokemon} />)
      ) : (
        <div>No Pokemon selected</div>
      )}
    </aside>
  );
};

Aside.propTypes = {
  pokemons: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Aside;

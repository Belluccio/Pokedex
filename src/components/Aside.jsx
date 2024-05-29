import React from "react";
import PokemonDetails from "./PokemonDetails";
import PropTypes from 'prop-types';

const Aside = ({ pokemon }) => {
  return (
    <aside className="bg-gray-200 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Pokemon Details</h2>
      {pokemon ? (
        <PokemonDetails pokemon={pokemon} />
      ) : (
        <div>No Pokemon selected</div>
      )}
    </aside>
  );
};

Aside.propTypes = {
  pokemon: PropTypes.object,
};

export default Aside;

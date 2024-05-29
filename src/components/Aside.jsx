import React from 'react';
import PokemonDetails from './PokemonDetails';
import PropTypes from 'prop-types';

const Aside = ({ pokemon }) => {
  return (
    <aside className="bg-gray-200 p-4 rounded-lg fixed right-0 top-0 h-screen w-[350px] overflow-auto shadow-lg flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center">
        <h2 className="text-xl font-bold mb-4 absolute top-4 left-4">Pokemon Details</h2>
        {pokemon ? (
          <PokemonDetails pokemon={pokemon} />
        ) : (
          <div>No Pokemon selected</div>
        )}
      </div>
    </aside>
  );
};

Aside.propTypes = {
  pokemon: PropTypes.object,
};

export default Aside;

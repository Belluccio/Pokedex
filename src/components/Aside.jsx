// Aside.js

import React from 'react';
import PropTypes from 'prop-types';
import PokemonDetails from './PokemonDetails';

const Aside = ({ pokemon, onPokemonClose }) => {
  const handleClose = () => {
    onPokemonClose();
  };

  return (
    <aside className={`bg-gray-200 p-4 rounded-lg fixed right-0 top-0 h-screen w-full md:w-[350px] overflow-auto shadow-lg ${!pokemon ? 'hidden md:flex' : 'flex'} flex-col`}>
      {pokemon ? (
        <div className="relative w-full h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-red-500 rounded-full h-8 w-8 flex items-center justify-center mr-2">
                {/* Texto o símbolo para representar una Pokébola */}
                <span className="text-white">⚫</span> 
              </div>
              <h2 className="text-xl font-bold">Pokemon Details</h2> {/* Eliminamos la clase de estilo */}
            </div>
            <button onClick={handleClose} className="p-2 rounded-full bg-red-500 text-white close-button"> {/* Añadimos la clase close-button */}
              {/* Texto o símbolo para representar una Pokébola */}
              <span className="text-white">X</span>
            </button>
          </div>
          <div className="border-t border-gray-400 pt-4">
            <PokemonDetails pokemon={pokemon} />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="text-lg">No Pokémon selected. Please select one to view details.</p>
        </div>
      )}
    </aside>
  );
};

Aside.propTypes = {
  pokemon: PropTypes.object,
  onPokemonClose: PropTypes.func.isRequired,
};

export default Aside;

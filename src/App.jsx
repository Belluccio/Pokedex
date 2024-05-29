import React, { useState } from 'react';
import Pokemons from "./components/Pokemons";
import Aside from "./components/Aside";

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const handlePokemonSelect = (pokemon) => {
    setSelectedPokemon(prevSelected => (prevSelected && prevSelected.id === pokemon.id) ? null : pokemon);
  };

  return (
    <section>
      <main className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_350px] h-screen font-outfit ">
        <Pokemons onPokemonSelect={handlePokemonSelect} />
        <Aside pokemon={selectedPokemon} />
      </main>
    </section>
  );
}

export default App;

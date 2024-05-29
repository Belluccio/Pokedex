import React, { useState } from 'react';
import Pokemons from "./components/Pokemons";
import Aside from "./components/Aside";

function App() {
  const [selectedPokemons, setSelectedPokemons] = useState([]);

  const handlePokemonSelect = (pokemon) => {
    setSelectedPokemons(prevSelected => {
      if (prevSelected.some(p => p.id === pokemon.id)) {
        return prevSelected.filter(p => p.id !== pokemon.id);
      } else {
        return [...prevSelected, pokemon];
      }
    });
  };

  return (
    <section>
      <main className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_350px] h-screen font-outfit ">
        <Pokemons onPokemonSelect={handlePokemonSelect} />
        <Aside pokemons={selectedPokemons} />
      </main>
    </section>
  );
}

export default App;

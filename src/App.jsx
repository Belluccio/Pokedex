import React, { useState, useEffect } from 'react';
import Pokemons from "./components/Pokemons";
import Aside from "./components/Aside";
import './index.css'; //

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);

  const handlePokemonSelect = (pokemon) => {
    setSelectedPokemon(prevSelected => (prevSelected && prevSelected.id === pokemon.id) ? null : pokemon);
  };

  const handleScroll = () => {
    if (window.pageYOffset > 200) {
      setShowScrollTopButton(true);
    } else {
      setShowScrollTopButton(false);
    };
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section>
      <main className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_350px] h-screen font-outfit relative">
        <Pokemons onPokemonSelect={handlePokemonSelect} />
        <Aside pokemon={selectedPokemon} />
        {showScrollTopButton && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-10 lg:right-[375px] right-10 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 w-12 h-12 flex items-center justify-center"
            style={{ borderRadius: '50%' }}
          >
            ↑
          </button>
        )}
      </main>
    </section>
  );
}

export default App;

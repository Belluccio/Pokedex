import React from 'react';
import Pokemons from "./components/Pokemons";
import Aside from "./components/Aside";

function App() {
  return (
    <section className="bg-[#f6f8fc]">
      <main className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_350px] h-screen font-outfit ">
        <Pokemons />
        <Aside />
      </main>
    </section>
  );
}

export default App;

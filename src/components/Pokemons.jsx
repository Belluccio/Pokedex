import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IconSearch } from '@tabler/icons';
import PokemonList from "./PokemonList";
import PokemonDetails from "./PokemonDetails";

const Pokemons = () => {
  const [allPokemons, setAllPokemons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const loader = useRef(null);

  useEffect(() => {
    loadPokemons(page);
  }, [page]);

  const loadPokemons = async (pageNumber) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${(pageNumber - 1) * 20}&limit=20`);
      const newPokemons = response.data.results;
      setAllPokemons(prevPokemons => [...prevPokemons, ...newPokemons]);
      setHasMore(newPokemons.length > 0);
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleObserver = (entities) => {
    const target = entities[0];
    if (target.isIntersecting && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handlePokemonClick = (pokemonData) => {
    setSelectedPokemon(pokemonData); // Establece el Pokémon seleccionado en el estado
  };

  const observer = useRef(new IntersectionObserver(handleObserver, {
    root: null,
    rootMargin: "20px",
    threshold: 1.0
  }));

  useEffect(() => {
    const currentObserver = observer.current;
    if (loader.current) {
      currentObserver.observe(loader.current);
    }
    return () => currentObserver.disconnect();
  }, []);

  return (
    <section className="p-4 py-5 bg-gray-100 min-h-screen">
      <div className="bg-gray-100 mb-8">
        <form className="mb-4">
          <div className="bg-white p-2 flex">
            <input
              className="outline-none flex-1 rounded-2xl text-lg"
              type="text"
              placeholder="Search your Pokemon"
            />
            <button className="bg-red-500 p-2 rounded-md shadow-lg shadow-red-500/50 hover:bg-red-400 transition-colors">
              <IconSearch color="white" stroke={3} />
            </button>
          </div>
        </form>
        <PokemonList pokemons={allPokemons} onClick={handlePokemonClick} />
        {loading && <div>Loading...</div>}
        <div ref={loader}></div>
      </div>
      <PokemonDetails pokemon={selectedPokemon} />
    </section>
  );
};

export default Pokemons;

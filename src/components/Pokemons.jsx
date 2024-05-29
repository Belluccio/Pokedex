import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IconSearch } from '@tabler/icons';
import PokemonList from "./PokemonList";

const Pokemons = ({ onPokemonSelect }) => {
  const [allPokemons, setAllPokemons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const loader = useRef(null);

  useEffect(() => {
    loadPokemons(page);
  }, [page]);

  const loadPokemons = async (pageNumber) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${(pageNumber - 1) * 20}&limit=20`);
      const newPokemons = response.data.results;
      setAllPokemons(prevPokemons => pageNumber === 1 ? newPokemons : [...prevPokemons, ...newPokemons]);
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
    onPokemonSelect(pokemonData);
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
    return () => {
      if (loader.current) {
        currentObserver.unobserve(loader.current);
      }
    };
  }, [loader.current]);

  const filteredPokemons = allPokemons.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="p-4 py-5 bg-gray-100 min-h-screen">
      <div className="bg-gray-100 mb-8">
        <form className="mb-4" onSubmit={(e) => e.preventDefault()}>
          <div className="bg-white p-2 flex">
            <input
              className="outline-none flex-1 rounded-2xl text-lg"
              type="text"
              placeholder="Search your Pokemon"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-red-500 p-2 rounded-md shadow-lg shadow-red-500/50 hover:bg-red-400 transition-colors">
              <IconSearch color="white" stroke={3} />
            </button>
          </div>
        </form>
        <div className="flex">
          <div className="flex-1">
            <PokemonList pokemons={filteredPokemons} onClick={handlePokemonClick} />
            {loading && <div>Loading...</div>}
            <div ref={loader}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pokemons;

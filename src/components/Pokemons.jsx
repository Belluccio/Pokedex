import axios from "axios";
import { IconSearch } from '@tabler/icons';
import { useState, useEffect } from "react";
import PokemonList from "./PokemonList";

const Pokemons = () => {
  const [allPokemons, setAllPokemons] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrls, setPrevUrls] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon");
        setAllPokemons(response.data.results);
        setNextUrl(response.data.next);
        setPrevUrls([]);
        setTotalPages(1);
      } catch (error) {
        console.error("Error fetching Pokemon data:", error);
      }
    };

    fetchPokemons();
  }, []);

  const handleNextPage = async () => {
    if (nextUrl) {
      try {
        const response = await axios.get(nextUrl);
        setAllPokemons(response.data.results);
        setNextUrl(response.data.next);
        setPrevUrls([...prevUrls, response.data.previous]);
        setCurrentPage(currentPage + 1);
        if (!totalPages || currentPage === totalPages) {
          setTotalPages(currentPage + 1);
        }
      } catch (error) {
        console.error("Error fetching next page:", error);
      }
    }
  };

  const handlePrevPage = async () => {
    if (prevUrls.length > 0) {
      try {
        const prevUrl = prevUrls.pop();
        const response = await axios.get(prevUrl);
        setAllPokemons(response.data.results);
        setNextUrl(response.data.next);
        setPrevUrls([...prevUrls]);
        setCurrentPage(currentPage - 1);
      } catch (error) {
        console.error("Error fetching previous page:", error);
      }
    }
  };

  const handleLastPage = async () => {
    if (totalPages > 1) {
      try {
        const lastUrl = `https://pokeapi.co/api/v2/pokemon?offset=${(totalPages - 1) * 21}&limit=21`;
        const response = await axios.get(lastUrl);
        setAllPokemons(response.data.results);
        setNextUrl(response.data.next);
        setPrevUrls([]);
        setCurrentPage(totalPages);
      } catch (error) {
        console.error("Error fetching last page:", error);
      }
    }
  };

  return (
    <section className="p-4 py-5 bg-gray-100 min-h-screen">
      <div className="bg-gray-100">
        <div className="mb-8">
          <form className="mb-4">
            <div className="bg-white p-2 flex">
              <input className="outline-none flex-1 rounded-2xl text-lg" type="text" placeholder="Search your Pokemon" />
              <button className="bg-red-500 p-2 rounded-md shadow-lg shadow-red-500/50 hover:bg-red-400 transition-colors">
                <IconSearch color="white" stroke={3} />
              </button>
            </div>
          </form>
          <PokemonList pokemons={allPokemons} />
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 mr-2" onClick={handlePrevPage} disabled={prevUrls.length === 0}>
          Anterior
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 mr-2" onClick={handleNextPage} disabled={!nextUrl}>
          Siguiente
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600" onClick={handleLastPage} disabled={!totalPages || currentPage === totalPages}>
          Última
        </button>
      </div>
    </section>
  );
};

export default Pokemons;

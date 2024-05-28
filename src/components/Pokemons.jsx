import axios from "axios";
import { IconSearch } from '@tabler/icons';
import { useState, useEffect } from "react";
import PokemonList from "./PokemonList";

// Componente principal para manejar la lógica de los Pokémons
const Pokemons = () => {
  const [allPokemons, setAllPokemons] = useState([]);

  useEffect(() => {
    // Solicitud a la API para obtener la lista de Pokémons
    axios
      .get("https://pokeapi.co/api/v2/pokemon?limit=898")
      .then(({ data }) => {
        console.log(data.results); // Verificar la estructura de los datos
        setAllPokemons(data.results); // Guardar los resultados en el estado
      })
      .catch((err) => console.log(err)); // Manejar errores
  }, []);

  return (
    <section className="p-4 py-5">
      {/* Formulario de búsqueda (actualmente no funcional) */}
      <form>
        <div className="bg-white p-2 flex">
          <input
            className="outline-none flex-1 rounded-2xl text-lg"
            type="text"
            placeholder="Search your Pokemon"
          />
          <button
            type="submit"
            className="bg-red-500 p-2 rounded-md shadow-lg shadow-red-500/50 hover:bg-red-400 transition-colors"
          >
            <IconSearch color="white" stroke={3} />
          </button>
        </div>
      </form>
      {/* Componente que muestra la lista de Pokémons */}
      <PokemonList pokemons={allPokemons} />
    </section>
  );
};

export default Pokemons;

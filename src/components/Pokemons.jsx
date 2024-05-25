import axios from "axios";
import { IconSearch } from '@tabler/icons';
import { useState } from "react";
import { useEffect } from "react";


const Pokemons = () => {
  const [allPokemons, setAllPokemons] = useState([]);

  useEffect(() => {
    axios
    .get("https://pokeapi.co/api/v2/pokemon?Limit=898")
    .then(({ data }) => console.log(data))
    .catch((err) => console.log(err))
  }, []);

    return  <section>
        <form>
            <div>
                <input type="text" placeholder="Search your Pokemon" />
                <button>
                <IconSearch />
                </button>
            </div>
        </form>
    </section>;
  };
export default Pokemons;

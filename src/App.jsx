import Pokemons from "./components/Pokemons";
import Aside from "./components/Aside";

// Función principal de la aplicación
function App() {
  return (
    <section className="bg-[#f6f8fc]">
      <main className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_350px] h-screen font-outfit">
        {/* Componente que muestra la lista de Pokémons */}
        <Pokemons />
        {/* Componente adicional, como un menú lateral */}
        <Aside />
      </main>
    </section>
  );
}

export default App;

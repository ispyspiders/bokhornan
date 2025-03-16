import { useState } from "react";
import SearchForm from "../components/SearchForm"
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setError(''); // rensa felmeddelande när användare börjar skriva
  }

  // Hantera skicka formulär
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Kontrollera om söktermen är tom
    if (!searchTerm.trim()) {
      setError('Söktermen kan inte vara tom');
      return;
    }

    // Navigera till sökresultat sidan med sökterm
    navigate(`/search/${searchTerm}`)

  }

  return (
    <div className='p-0 py-12'>
      <div className="bg-blob bg-cover   ">
        <section className="flex flex-col  justify-center h-96 p-4 sm:px-12">
          <h2 className="text-4xl text-center">Hitta din nästa bok</h2>
          <SearchForm searchTerm={searchTerm} onSearchChange={handleSearchChange} error={error} onSubmit={handleSubmit} />
        </section>
      </div>
    </div>
  )
}

export default HomePage
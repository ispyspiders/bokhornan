import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Book } from '../types/book.types';
import { WarningCircle } from '@phosphor-icons/react';
import SearchImg from '../assets/shelves.gif';
import Pagination from '../components/Pagination';
import SearchForm from '../components/SearchForm';


const SearchPage = () => {
  const { searchTerm } = useParams(); // Hämta sökterm från url
  const [books, setBooks] = useState<Book[]>([]); // Array med böcker
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const maxResults = 10; // antal resultat per sida
  const [newSearchTerm, setNewSearchTerm] = useState('');
  const [newSearchError, setNewSearchError] = useState('');

  const navigate = useNavigate();

  // Hämta böcker utifrån sökterm
  const fetchBooks = async () => {
    setSearching(true);
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&startIndex=${startIndex}&maxResults=${maxResults}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw Error;
      }
      const data = await response.json();
      setBooks(data.items || []);
      setTotalItems(data.totalItems || 0); // sätt totala antal resultat
      setError('');
    } catch (error) {
      console.log("Fel vid inläsning av böcker:" + error);
      setError("Något gick fel vid inläsningen av böcker");
    } finally {
      setSearching(false);
    }
  }

  // Ladda nästa sida med sökresultat
  const handleNextPage = () => {
    if (startIndex + maxResults < totalItems) {
      setStartIndex(startIndex + maxResults); // hämta nästa sida
    }
  }

  // Ladda förgående sida med sökresultat
  const handlePreviousPage = () => {
    if (startIndex - maxResults >= 0)
      setStartIndex(startIndex - maxResults); // Hämta föregående sida
  }

  // Hantera uppdatering i sökformulär
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSearchTerm(e.target.value);
    setNewSearchError(''); // rensa felmeddelande när användare börjar skriva
  }

  // Skicka sökformulär
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Kontrollera om söktermen är tom
    if (!newSearchTerm.trim()) {
      setError('Söktermen kan inte vara tom');
      return;
    }

    navigate(`/search/${newSearchTerm}`)
    
  }

  useEffect(() => {
    if (searchTerm) fetchBooks();

  }, [searchTerm, startIndex]);

  return (
    <div className='p-12'>
      {searching && (
        <div>
          <h2>Söker efter böcker...</h2>
          <img src={SearchImg} alt="Bookshelf" className='mx-auto' />
          <a href="https://www.flaticon.com/free-animated-icons/library" title="library animated icons" className='text-xs text-dark-soft'>Library animated icons created by Freepik - Flaticon</a>
        </div>
      )}

      {/* Under sökning */}
      {!searching &&
        <div>
          <h2 className='mb-2'>Sökresultat för: <span className='font-serif'>{searchTerm}</span></h2>
          {/* Felmeddelande */}
          {error && (
            <div className="bg-coral bg-opacity-10 border-2 border-coral rounded-md p-2 my-4 flex items-center text-sm">
              <WarningCircle size={24} className="text-coral me-2" /> {error}
            </div>
          )}

          {/* Resultat */}
          {books.length > 0 ? (
            <div className='rounded-lg overflow-x-scroll'>
              <table className='table-auto font-montserrat w-full text-sm drop-shadow-sm  rounded-lg overflow-hidden'>
                <thead>
                  <tr className='bg-blush-mid text-sm font-semibold text-left'>
                    <th className='py-2 px-4'></th>
                    <th className='py-2 px-4'>Titel</th>
                    <th className='py-2 px-4'>Författare</th>
                    <th className='py-2 px-4'>Utgiven</th>
                    <th className='py-2 px-4'></th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id} className='bg-light w-full border-b border-blush-mid'>
                      <td><img src={book.volumeInfo?.imageLinks?.smallThumbnail || ''} alt="" /></td>
                      <td>{book.volumeInfo?.title || "Ingen titel tillgänglig"}</td>
                      <td> {book.volumeInfo?.authors ? book.volumeInfo.authors.join(", ") : "Ingen författare tillgänglig"}</td>
                      <td className=''>{book.volumeInfo?.publishedDate || "Inget utgivningsdatum tillgängligt"}</td>
                      <td>gillamarkeringar här</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination startIndex={startIndex} maxResults={maxResults} totalItems={totalItems} onPrevious={handlePreviousPage} onNext={handleNextPage} />
            </div>
          ) : (
            <p>Inga resultat funna.</p>
          )}

          <div className='bg-light rounded-lg p-4 my-12 mx-auto  drop-shadow-sm'>
            <h3 className='text-center text-lg'>Inte vad du letade efter?</h3>
            <SearchForm searchTerm={newSearchTerm} error={newSearchError} onSearchChange={handleSearchChange} onSubmit={handleSubmit} />
          </div>
        </div>
      }



    </div>
  )
}

export default SearchPage
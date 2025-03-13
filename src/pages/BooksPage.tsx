import { MagnifyingGlass } from '@phosphor-icons/react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const BooksPage = () => {
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
        <div className='p-12'>
            <h2 className='mb-2'>Böcker</h2>
            <p className='text-lg text-dark-soft'>Här kan du söka efter böcker baserat på titel, författare eller genre, samt upptäcka de mest populära böckerna just nu. Utforska böcker för att hitta din nästa läsupplevelse!</p>

            <form onSubmit={handleSubmit} className='flex items-baseline my-8'>
                <div className='w-full'>

                    <input
                        type="text"
                        id='search'
                        value={searchTerm}
                        placeholder='Sök efter titel, författare eller genre... '
                        onChange={handleSearchChange}
                        className="text-md p-2 w-full rounded-s-md border border-e-0 border-blush-mid drop-shadow-sm focus:outline-blush-deep"
                    />
                    {error && <span className="text-sm font-light mt-2 ms-2 text-red-500 w-full">{error}</span>}
                </div>

                <button className='rounded-s-none m-0 ps-6 border border-s-0 border-blush-mid drop-shadow-sm'>
                    <span className='me-2'>Sök</span>
                    <MagnifyingGlass size={24} />
                </button>
            </form>

            <h3 >Sök efter böcker</h3>
            <p>Använd vårt sökverktyg för att snabbt hitta böcker som passar din smak. Du kan söka på:</p>
            <ul className='font-serif list-disc ms-12'>
                <li className='mb-2'><span className='font-bold'>Titel</span> <br /> Skriv bokens namn för att hitta den direkt.</li>
                <li className='mb-2'><span className='font-bold'>Författare</span> <br /> Skriv författarens namn för att hitta deras verk.</li>
                <li className='mb-2'><span className='font-bold'>Genre</span> <br /> Filtrera böcker efter genre, till exempel fantasy, thriller, romance, och mycket mer.</li>
            </ul>

            <section className='mt-12'>
                <h2>Topplista - De 4 mest gillade böckerna</h2>
                <p className='text-lg text-dark-soft'>Här är de 5 böcker som just nu får mest kärlek från våra användare! Håll dig uppdaterad med de senaste favoriterna och hitta inspiration för din nästa bok.</p>
                <div className='bg-wave'>
                    läs ut mest gillade böcker
                </div>
            </section>

        </div>
    )
}

export default BooksPage
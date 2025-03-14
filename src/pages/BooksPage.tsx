import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SearchForm from '../components/SearchForm';

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

            <SearchForm searchTerm={searchTerm} onSearchChange={handleSearchChange} error={error} onSubmit={handleSubmit} />

            <h3 >Sök efter böcker</h3>
            <p>Använd vårt sökverktyg för att snabbt hitta böcker som passar din smak. Du kan söka på:</p>
            <ul className='font-serif list-disc ms-12'>
                <li className='mb-2'><span className='font-bold'>Titel</span> <br />Skriv <em>intitle:</em> följt av sökord för att endast söka inom titel. <br /> Exempel: <span className='font-sans ms-2'>intitle:Collecting cats</span></li>
                <li className='mb-2'><span className='font-bold'>Författare</span> <br /> Skriv <em>inauthor:</em> följt av sökord för att söka inom författare. <br /> Exempel: <span className='font-sans ms-2'>inauthor:Lorna Scobie</span></li>
                <li className='mb-2'><span className='font-bold'>Genre</span> <br /> Skriv <em>subject:</em> följt av sökord för att söka inom genre. Exempel: <span className='font-sans ms-2'>subject:Juvenile Fiction</span></li>
            </ul>
            <div className="bg-light rounded-lg p-4 mt-8 drop-shadow-sm w-fit mx-8">
                <p className='max-w-none m-0'>Tips! För att få mer exakta resultat skriv din sökterm inom citattecken. <br />Exempel: <span className='font-sans ms-2'>"Lorna Scobie"</span> istället för <span className='font-sans'>Lorna Scobie</span>.</p>
            </div>

            <section className='mt-12'>
                <h2>Topplista - De 5 mest gillade böckerna</h2>
                <p className='text-lg text-dark-soft'>Här är de 5 böcker som just nu får mest kärlek från våra användare! Håll dig uppdaterad med de senaste favoriterna och hitta inspiration för din nästa bok.</p>
                <div className='bg-wave'>
                    läs ut mest gillade böcker
                </div>
            </section>

        </div>
    )
}

export default BooksPage
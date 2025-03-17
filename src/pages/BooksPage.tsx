import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import { LikedBook } from '../types/book.types';
import { url } from '../types/auth.types';
import { SpinnerGap, WarningCircle } from '@phosphor-icons/react';
import LikedBookCard from '../components/LikedBookCard';

const BooksPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    const [likedBooks, setLikedBooks] = useState<LikedBook[]>([]);
    const [loadingLikedBooks, setLoadingLikedBooks] = useState<boolean>(false);
    const [likedBooksError, setLikedBooksError] = useState<string | null>(null);

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

    // Hämta de fem mest gillade böckerna
    const fetchLikedBooks = async () => {
        setLoadingLikedBooks(true);
        try {
            const response = await fetch(`${url}/book/mostliked`, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) throw Error;
            const data = await response.json();
            setLikedBooks(data);
        } catch (error) {
            console.error('Fel vid hämtning av mest gillade böcker:', error);
            setLikedBooksError('Något gick fel vid hämtning av mest gillade böcker.');
        } finally {
            setLoadingLikedBooks(false);
        }
    }

    useEffect(() => {
        fetchLikedBooks();
    }, []);


    return (
        <div className='py-12'>
            <div className='p-4 md:px-12'>

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

            </div>
            <section className='mt-12'>
                <h2 className='ps-4 md:ps-12'>Topplista - De 5 mest gillade böckerna</h2>
                <p className='ps-4 md:ps-12 text-lg text-dark-soft'>Här är de 5 böcker som just nu får mest kärlek från våra användare! Håll dig uppdaterad med de senaste favoriterna och hitta inspiration för din nästa bok.</p>
                <div className='bg-wave bg-cover'>
                    {likedBooksError && (
                        <div className="bg-coral bg-opacity-10 border-2 border-coral rounded-md p-2 my-4 flex items-center text-sm">
                            <WarningCircle size={24} className="text-coral me-2" /> {likedBooksError}
                        </div>
                    )}
                    {loadingLikedBooks ? (
                        <div className='bg-light rounded-lg p-4 my-12 mx-auto drop-shadow-sm flex'>
                            Läser in gillade böcker... <SpinnerGap size={24} className="animate-spin ms-2" />
                        </div>
                    ) : (
                        <>
                            {
                                likedBooks.length > 0 ? (
                                    <div className="px-4 md:ps-12 flex flex-wrap gap-8">
                                        {
                                            likedBooks.map((likedBook, index) => (
                                                <div>
                                                    <div className='bg-flower bg-no-repeat bg-cover w-11 h-11 flex items-center justify-center relative top-6 left-32 z-20 '>
                                                        <span key={index} className='font-display text-2xl text-white mb-1 lining-nums'>{index + 1}</span>
                                                    </div>

                                                    <LikedBookCard
                                                        key={likedBook.book_id}
                                                        thumbnail={likedBook.thumbnail}
                                                        title={likedBook.title}
                                                        bookId={likedBook.book_id}
                                                        readonly={true}
                                                    />
                                                </div>
                                            ))
                                        }
                                    </div>
                                ) : (
                                    <>
                                        {!loadingLikedBooks &&
                                            <div className='bg-light rounded-lg p-4 my-4 mx-auto drop-shadow-sm flex'>
                                                <p className='m-0 font-montserrat text-sm'>Det finns inga gillade böcker att läsa ut.</p>
                                            </div>
                                        }
                                    </>
                                )
                            }
                        </>

                    )}

                </div>
            </section>

        </div>
    )
}

export default BooksPage
import { useEffect, useState } from 'react'
import { Book, bookUrl } from '../types/book.types'
import { Link, useParams } from 'react-router-dom';
import { BookOpenText, SpinnerGap, WarningCircle } from '@phosphor-icons/react';
import LikeButton from '../components/LikeButton';
import ReviewForm from '../components/ReviewForm';
import { Review } from '../types/review.types';
import { url } from '../types/auth.types';
import BookPageReview from '../components/BookPageReview';
import defaultCover from '../assets/defaultCover.png'



const BookPage = () => {
    const [book, setBook] = useState<Book | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [reviewError, setReviewError] = useState<string | null>(null);
    const [sortOption, setSortOption] = useState<string>('newest');
    const [filterRating, setFilterRating] = useState<number | null>(null);

    const { bookid } = useParams<{ bookid: string }>(); // id från adressrad

    // Hämta bok
    const fetchBook = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${bookUrl}/${bookid}`, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) throw Error;
            const data = await response.json() as Book;
            setBook(data);
            setError(null);
        } catch (error) {
            console.log("Något gick fel vid inläsning av bok: ", error);
            setError("Något gick fel vid inläsning av bok.");
        } finally {
            setLoading(false);
        }
    }

    // Hämta recensioner för bok
    const fetchReviews = async () => {
        setLoadingReviews(true);
        try {
            const response = await fetch(`${url}/book/${bookid}/reviews`, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });
            if (response.ok) {
                const data = await response.json();
                setReviews(data);
                setReviewError(null);
            } else if (response.status === 404) {
                setReviews([]);
                setReviewError(null);
            } else {
                throw Error;
            }
        } catch (error) {
            console.log("Fel vid inläsning av recensioner: ", error);
            setReviewError("Ett fel inträffade vid inläsning av recensioner")
        } finally {
            setLoadingReviews(false);
        }
    }

    // Sortera recensioner baserat på valt alternativ
    const sortReviews = (reviews: Review[], option: string) => {
        switch (option) {
            case 'newest':
                return reviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            case 'oldest':
                return reviews.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
            case 'higestRating':
                return reviews.sort((a, b) => b.rating - a.rating);
            case 'lowestRating':
                return reviews.sort((a, b) => a.rating - b.rating);
            default: return reviews;
        }
    }

    // Filtrera recensioner baserat på betyg
    const filterReviewsByRating = (reviews: Review[], rating: number | null) => {
        if (rating === null) return reviews; // returnera alla recensioner om rating är null
        return reviews.filter((review) => review.rating === rating);
    };

    // Skicka recension
    const handleReviewCreated = (newReview: Review) => {
        // Lägg till ny review i listan
        setReviews((prevReviews) => [newReview, ...prevReviews]);
    };

    // hantera filtrerings ändring 
    const handleFilterRatingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value === 'all' ? null : parseInt(event.target.value, 10);
        setFilterRating(value);
    }

    // Hämta bokinformation och recensioner vid initiell rendering
    useEffect(() => {
        fetchBook();
        fetchReviews();
    }, [bookid]);

    let filteredReviews = filterReviewsByRating(reviews, filterRating);
    filteredReviews = sortReviews(filteredReviews, sortOption);

    return (
        <div className='p-4 py-12 md:p-12'>
            {/* Bokinformation */}
            <h2>Bokinformation</h2>
            {book ? (
                <>
                    {/* Bookinfo-ruta */}
                    <section className='bg-light rounded-lg py-2 px-8 my-4 sm:px-12  mx-auto drop-shadow-sm'>
                        {/* Titelrad */}
                        <div className='flex flex-col items-end sm:flex-row sm:justify-between sm:items-end border-b border-blush-mid pb-4'>
                            {/* Titel och författare */}
                            <div className='w-full mb-2 sm:mb-0'>
                                <h3 className='font-serif text-dark text-2xl font-bold mb-0'>{book.volumeInfo.title}</h3>
                                <p className='mb-0'><span>av </span>
                                    {
                                        book.volumeInfo.authors ? (
                                            <>
                                                {book.volumeInfo.authors.map((author, index) => (
                                                    <Link to={`/search/${author}`} key={index} className='font-semibold text-dark-soft hover:underline'>
                                                        {author}
                                                        {index < book.volumeInfo.authors.length - 1 && ", "}
                                                    </Link>

                                                ))}
                                            </>
                                        ) : (
                                            <p> Ingen författare tillgänglig</p>
                                        )
                                    }
                                </p>
                            </div>
                            {/* Gilla-knapp */}
                            <LikeButton bookId={book.id} title={book.volumeInfo.title} thumbnail={book.volumeInfo?.imageLinks?.thumbnail || defaultCover} />
                        </div>

                        <div className='flex flex-col-reverse lg:grid grid-cols-2 lg:gap-12'>
                            {/* Om boken */}
                            <div>
                                <h4 className='font-serif font-bold mt-8 text-lg mb-4'>Om boken</h4>
                                {/* Beskrivning, dangerously set för att renderas korrekt */}
                                <div dangerouslySetInnerHTML={{ __html: book.volumeInfo.description || 'Ingen beskrivning tillgänglig' }} className='font-serif leading-7 mb-8'></div>
                            </div>
                            {/* Bild och detaljinfo */}
                            <div className='border-b border-blush-mid pb-8 sm:flex lg:flex-col lg:border-none'>
                                    <img src={`${book?.volumeInfo?.imageLinks?.thumbnail || defaultCover}`} alt={`Omslag för ${book.volumeInfo.title}`} className='m-8 max-w-max max-h-max lg:ms-0' />
                                <div className='w-1/2 mt-8 lg:mt-0'>
                                    <p className='sm:w-1/2 lg:w-full'><span className='font-medium'>Utgiven: </span>{book.volumeInfo.publishedDate}</p>
                                    <p className='sm:w-1/2 lg:w-full'><span className='font-medium'>Format: </span>{book.volumeInfo.printType}</p>
                                    <p className='sm:w-1/2 lg:w-full'><span className='font-medium'>Språk: </span>{book.volumeInfo.language}</p>
                                    <p className='sm:w-1/2 lg:w-full'><span className='font-medium'>Antal sidor: </span>{book.volumeInfo.pageCount}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Recensioner */}
                    <section>
                        <h2>Recensioner</h2>
                        <div className='bg-blush-deep rounded-lg p-2 my-4 sm:p-4  mx-auto drop-shadow-sm'>
                            {/* Recensionsformulär */}
                            <ReviewForm bookId={book.id} bookTitle={book.volumeInfo.title} onReviewCreated={handleReviewCreated} />

                            {/* Fel vid inläsning av recensioner*/}
                            {reviewError &&
                                <div className="bg-coral bg-opacity-10 border-2 border-coral rounded-md p-2 my-4 flex items-center text-sm">
                                    <WarningCircle size={24} className="text-coral me-2" /> {reviewError}
                                </div>
                            }

                            {/* Laddar recensioner */}
                            {loadingReviews &&
                                <div className='bg-light rounded-lg p-4 my-4 mx-auto drop-shadow-sm flex'>
                                    Läser in recensioner... <SpinnerGap size={24} className="animate-spin ms-2" />
                                </div>
                            }

                            <div className='flex flex-col sm:flex-row sm:justify-between sm:gap-8 mt-8'>
                                {/* Filtrering av recensioner */}
                                <div className="flex flex-col w-1/2">
                                    <label className="text-sm font-light mb-2 mt-4" htmlFor="password">Filtrera</label>
                                    <select name="filterRating" id="filterRating" value={filterRating !== null ? filterRating : 'all'}
                                        onChange={handleFilterRatingChange} className='text-md p-2 rounded border border-blush-mid drop-shadow-sm focus:bg-blush-light'>
                                        <option value="all">Alla betyg</option>
                                        <option value={1}>1 stjärna</option>
                                        <option value={2}>2 stjärnor</option>
                                        <option value={3}>3 stjärnor</option>
                                        <option value={4}>4 stjärnor</option>
                                        <option value={5}>5 stjärnor</option>
                                    </select>
                                </div>

                                {/* Sortering av recensioner */}
                                <div className="mb-4 flex flex-col w-1/2">
                                    <label className="text-sm font-light mb-2 mt-4" htmlFor="password">Sortera</label>
                                    <select name="sort" id="sort" value={sortOption} onChange={(e) => { setSortOption(e.target.value) }}
                                        className='text-md p-2 rounded border border-blush-mid drop-shadow-sm focus:bg-blush-light'>
                                        <option value="newest">Nyast</option>
                                        <option value="oldest">Äldst</option>
                                        <option value="highestRating">Högst betyg</option>
                                        <option value="lowestRating">Lägst betyg</option>
                                    </select>
                                </div>
                            </div>

                            {/* Skriv ut recensioner */}
                            {filteredReviews.length > 0 ? (
                                filteredReviews.map((review) => (
                                    <BookPageReview review={review} key={review.id} />
                                ))
                            ) : (
                                <>
                                    {!loadingReviews &&
                                        <div className='bg-light rounded-lg p-4 my-4 mx-auto drop-shadow-sm flex'>
                                            <p className='m-0'>Det finns inga recensioner att läsa ut för denna bok.</p>
                                        </div>
                                    }
                                </>
                            )}

                        </div>
                    </section>
                </>
            ) : (
                <>
                    {/* Läser in bok */}
                    {loading &&
                        <div className='bg-light rounded-lg p-4 my-12 mx-auto drop-shadow-sm flex'>
                            Läser in bok... <SpinnerGap size={24} className="animate-spin ms-2" />
                        </div>

                    }

                    {/* Felmeddelande */}
                    {error &&
                        <div className="bg-coral bg-opacity-10 border-2 border-coral rounded-md p-2 my-4 flex items-center text-sm">
                            <WarningCircle size={24} className="text-coral me-2" /> {error}
                        </div>
                    }
                </>
            )}

        </div>
    )
}

export default BookPage
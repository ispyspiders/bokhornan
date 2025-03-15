import { useEffect, useState } from 'react'
import { Book, bookUrl } from '../types/book.types'
import { Link, useParams } from 'react-router-dom';
import { SpinnerGap, WarningCircle } from '@phosphor-icons/react';
import LikeButton from '../components/LikeButton';
import ReviewForm from '../components/ReviewForm';
import { Review } from '../types/review.types';
import { url } from '../types/auth.types';
import BookPageReview from '../components/BookPageReview';


const BookPage = () => {
    const [book, setBook] = useState<Book | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [reviewError, setReviewError] = useState<string | null>(null);

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

    // Skicka recension
    const handleReviewCreated = (newReview: Review) => {
        // Lägg till ny review i listan
        setReviews((prevReviews) => [newReview, ...prevReviews]);
    };

    // Hämta bokinformation och recensioner vid initiell rendering
    useEffect(() => {
        fetchBook();
        fetchReviews();
    }, [])

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
                            <LikeButton bookId={book.id} />
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
                                <img src={`${book.volumeInfo.imageLinks.thumbnail}`} alt={`Omslag för ${book.volumeInfo.title}`} className='m-8 max-w-max max-h-max lg:ms-0' />
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
                            <ReviewForm bookId={book.id} onReviewCreated={handleReviewCreated} />

                            {/* Fel vid inläsning */}
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

                            {/* Skriv ut recensioner */}
                            {reviews.length > 0 ? (
                                reviews.map((review) => (
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
import { useEffect, useState } from "react";
import SearchForm from "../components/SearchForm"
import { useNavigate } from "react-router-dom";
import { url } from "../types/auth.types";
import { Review } from "../types/review.types";
import { SpinnerGap, WarningCircle } from "@phosphor-icons/react";
import Carousel from "../components/Carousel";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

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

  //Hämta reviews
  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const response = await fetch(`${url}/reviews/latest`, {
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

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className='p-0 -pt-10'>
      <div className="bg-blob bg-cover">
        <section className="flex flex-col  justify-center h-96 p-4 sm:px-12">
          <h2 className="text-4xl text-center">Hitta din nästa bok</h2>
          <SearchForm searchTerm={searchTerm} onSearchChange={handleSearchChange} error={error} onSubmit={handleSubmit} />
        </section>

        <section>
          <div className="m-4">

            <h2>Senaste recensionerna</h2>
            {reviewError && (
              <div className="bg-coral bg-opacity-10 border-2 border-coral rounded-md p-2 my-4 flex items-center text-sm">
                <WarningCircle size={24} className="text-coral me-2" /> {reviewError}
              </div>
            )}

            {/* Laddar recensioner */}
            {loadingReviews &&
              <div className='bg-light rounded-lg p-4 my-4 mx-auto drop-shadow-sm flex'>
                Läser in recensioner... <SpinnerGap size={24} className="animate-spin ms-2" />
              </div>
            }
          </div>


          {reviews.length > 0 ? (
            <div className="-mx-4 sm:mx-auto">
              <Carousel reviews={reviews} />

            </div>


          ) : (
            <>
              {!loadingReviews &&
                <div className='bg-light rounded-lg p-4 my-4 mx-auto drop-shadow-sm flex'>
                  <p className='m-0'>Det finns inga recensioner att läsa ut.</p>
                </div>

              }
            </>
          )}
        </section>
      </div>
    </div>
  )
}

export default HomePage
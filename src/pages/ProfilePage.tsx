import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { SpinnerGap, Trash, WarningCircle } from "@phosphor-icons/react";
import { url } from "../types/auth.types";
import ProfileCard from "../components/ProfileCard";
import LikedBookCard from "../components/LikedBookCard";
import { LikedBook } from "../types/book.types";
import { Review } from "../types/review.types";
import ReviewRow from "../components/ReviewRow";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  is_admin: boolean;
  bio: string;
  current_read: string;
  avatar_file: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

const ProfilePage = () => {
  const { user } = useAuth();  // Hämta den inloggade användaren från kontexten
  const { userId } = useParams<{ userId: string }>(); // hämta användarid från adressrad
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [likedBooks, setLikedBooks] = useState<LikedBook[]>([]);
  const [loadingLikedBooks, setLoadingLikedBooks] = useState<boolean>(false);
  const [likedBooksError, setLikedBooksError] = useState<string | null>(null);


  // Läs in profilinfo
  const fetchProfile = async () => {
    setLoading(true);
    try {
      if (user && user.id == userId) {
        // Om inloggad användare är profilens ägare
        setProfile(user);
      } else {
        // Hämta profilinfo för annan användare
        const response = await fetch(`${url}/user/${userId}`, {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) throw Error;
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error("Fel vid hämtning av profil: ", error);
    } finally {
      setLoading(false);
    }
  }

  // Läs in gillade böcker
  const fetchLikedBooks = async () => {
    setLoadingLikedBooks(true);
    try {
      const response = await fetch(`${url}/user/${userId}/likedbooks`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) throw Error;
      const data = await response.json();
      setLikedBooks(data);
    } catch (error) {
      console.error('Fel vid hämtning av gillade böcker:', error);
      setLikedBooksError('Något gick fel vid hämtning av gillade böcker.');
    } finally {
      setLoadingLikedBooks(false);
    }
  }

  // Läs in recensioner
  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const response = await fetch(`${url}/user/${userId}/reviews`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      } else if (response.status === 404) {
        setReviews([]);
        setReviewError(null);
      } else {
        throw Error;
      }

    } catch (error) {
      console.error('Fel vid hämtning av recensioner:', error);
      setReviewError('Något gick fel vid hämtning av recensioner.');
    } finally {
      setLoadingReviews(false);
    }
  }

  // Öppna delete modal
  const handleDeleteRequest = (id: string) => {
    const review = reviews.find((review) => review.id === id);
    if (review) {
      setReviewToDelete(review);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  }

  const handleDelete = async () => {
    if (reviewToDelete) {
      setDeleting(true);
      try {
        const response = await fetch(`${url}/review/${reviewToDelete.id}`, {
          method: 'DELETE',
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("bookToken")
          }
        })
        if (!response.ok) {
          setReviewError("Ett fel inträffade vid radering av recension");
          throw Error;
        }
        setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewToDelete.id));
        handleCloseModal();
        setReviewError(null);
      } catch (error) {
        console.error("Fel vid radering av recension: ", error);
      } finally {
        setDeleting(false);
      }
    }
  }


  // Läs in profil, gillade böcker och recensioner om användarid finns
  useEffect(() => {
    if (userId) {
      fetchProfile();
      fetchLikedBooks();
      fetchReviews();
    }
  }, [userId, user]);

  if (loading) {
    return <div className='bg-light rounded-lg p-4 my-12 mx-auto drop-shadow-sm flex'>
      Läser in profil... <SpinnerGap size={24} className="animate-spin ms-2" />
    </div>;
  }

  if (!profile) {
    return <div className="bg-coral bg-opacity-10 border-2 border-coral rounded-md p-2 my-4 flex items-center text-sm">
      <WarningCircle size={24} className="text-coral me-2" /> Profilen kunde inte hittas.
    </div>
  }

  const isOwnProfile = user?.id == userId; // Kollar om det är ens egen profil

  return (
    <div className='p-4 py-12 md:p-12'>
      <h2>Profil</h2>
      {/* Profilkort */}
      <ProfileCard user={profile} isOwnProfile={isOwnProfile} reviewCount={0} likedBooksCount={0} />

      <h3 className="text-xl mt-8">Gillade böcker</h3>
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
              <div className="flex flex-wrap gap-4">
                {
                  likedBooks.map((likedBook) => (
                    <LikedBookCard
                      key={likedBook.book_id}
                      thumbnail={likedBook.thumbnail}
                      title={likedBook.title}
                      bookId={likedBook.book_id}
                      readonly={user?.id != userId}
                    />
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

      )
      }

      <h3 className="text-xl mt-8">Recensioner</h3>
      {reviewError && (
        <div className="bg-coral bg-opacity-10 border-2 border-coral rounded-md p-2 my-4 flex items-center text-sm">
          <WarningCircle size={24} className="text-coral me-2" /> {reviewError}
        </div>
      )}

      {loadingReviews ? (
        <div className='bg-light rounded-lg p-4 my-12 mx-auto drop-shadow-sm flex'>
          Läser in recensioner... <SpinnerGap size={24} className="animate-spin ms-2" />
        </div>
      ) : (
        <>
          {showModal && (
            <div className='bg-dark-soft rounded-lg bg-opacity-80 z-10 fixed inset-0 flex items-center justify-center'>
              <div className="bg-white rounded-lg m-2 mt-4 h-fit border-4 border-coral">
                <div className='mb-4 bg-coral bg-opacity-10 rounded-t py-2 flex items-center'>
                  <WarningCircle size={24} className='text-coral ms-4' />
                  <h3 className='font-montserrat font-bold text-lg m-0 ms-2'>Radera recension</h3>
                </div>
                <p className="mx-4 font-montserrat">Är du säker på att du vill ta bort denna recension?</p>
                <p className="mx-4 font-montserrat">Denna åtgärd går inte att ångra.</p>
                <div className="flex justify-end gap-4 mt-4 p-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-blush-mid text-sm m-0 py-2 px-4 rounded-lg hover:bg-opacity-80"
                  >
                    Avbryt
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-coral text-white text-sm m-0 ps-6 pe-4 rounded-lg hover:bg-coral hover:bg-opacity-80"
                    disabled={deleting}
                  >
                    {deleting ? (
                      <span className="flex">
                        Raderar... <SpinnerGap size={20} className="ms-2 animate-spin" />
                      </span>
                    ) : (
                      <span className="flex">
                        Radera <Trash size={20} className="ms-2" />
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}


          <div className='rounded-lg overflow-x-scroll sm:overflow-hidden'>
            {reviews.length > 0 ? (
              < table className='table-auto font-montserrat w-full text-sm drop-shadow-sm  rounded-lg overflow-hidden'>
                <thead>
                  <tr className='bg-blush-mid text-sm font-semibold text-left'>
                    <th className='py-2 px-2'>Titel</th>
                    <th className='py-2 px-2'>Publicerat</th>
                    <th className='py-2 px-2'>Betyg</th>
                    <th className='py-2 px-2'></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    reviews.map((review) => (
                      <ReviewRow key={review.id} review={review} onDeleteRequest={handleDeleteRequest} />
                    ))
                  }
                </tbody>
              </table>
            ) : (
              <>
                {!loadingReviews &&
                  <div className='bg-light rounded-lg p-4 my-4 mx-auto drop-shadow-sm flex'>
                    <p className='m-0 font-montserrat text-sm'>Det finns inga recensioner att läsa ut.</p>
                  </div>
                }
              </>
            )

            }
          </div>
        </>
      )
      }

    </div >
  )
}

export default ProfilePage
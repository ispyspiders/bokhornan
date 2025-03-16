import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { SpinnerGap, WarningCircle } from "@phosphor-icons/react";
import { url } from "../types/auth.types";
import ProfileCard from "../components/ProfileCard";
import LikedBookCard from "../components/LikedBookCard";
import { bookUrl, LikedBook } from "../types/book.types";
import { Review } from "../types/review.types";

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


  // Läs in kommentarer
  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const response = await fetch(`${url}/user/${userId}/reviews`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) throw Error;
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Fel vid hämtning av recensioner:', error);
      setLikedBooksError('Något gick fel vid hämtning av recensioner.');
    } finally {
      setLoadingReviews(false);
    }
  }


  // Läs in profil och gillade böcker om användarid finns
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

      <h3>Gillade böcker</h3>
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
      )
      }

      <h3>Recensioner</h3>
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
        reviews.map((review) => (
          <div key={review.id} className="border">
            {review.created_at}
            {review.rating}
          </div>
        ))
      )
      }

    </div >
  )
}

export default ProfilePage
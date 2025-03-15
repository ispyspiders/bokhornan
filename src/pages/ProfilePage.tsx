import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { SpinnerGap, WarningCircle } from "@phosphor-icons/react";
import { url } from "../types/auth.types";
import ProfileCard from "../components/ProfileCard";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  is_admin: boolean;
  bio: string;
  current_read: string;
  avatar_file: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

const ProfilePage = () => {
  const { user } = useAuth();  // Hämta den inloggade användaren från kontexten
  const { userId } = useParams<{ userId: string }>(); // hämta användarid från adressrad
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

  // Läs in kommentarer


  useEffect(() => {
    if(userId){
      fetchProfile();
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
      <ProfileCard user={profile} isOwnProfile={isOwnProfile} reviewCount={0} likedBooksCount={0}/>


    </div>
  )
}

export default ProfilePage
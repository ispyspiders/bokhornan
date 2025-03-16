import React, { useEffect, useState } from 'react'
import { url } from '../types/auth.types';
import { Heart, SpinnerGap, WarningCircle } from '@phosphor-icons/react';
import { useAuth } from "../context/AuthContext";


interface LikeButtonProps {
    bookId: string; // Bokens id
    title: string;
    thumbnail: string;
    readonly?: boolean
}

const LikeButton: React.FC<LikeButtonProps> = ({ bookId, title, thumbnail, readonly }) => {

    const [likeCount, setLikeCount] = useState<number>(0);
    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    const { user } = useAuth();

    // Kontrollera om bok redan är gillad
    const checkIfLiked = async () => {
        if (user) {
            try {
                const response = await fetch(`${url}/user/${Number(user.id)}/likedbooks`, {
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    }
                });

                const data = await response.json();
                const isLiked = data.some((likedBook: { book_id: string }) => likedBook.book_id === bookId);
                setLiked(isLiked);
            } catch (error) {
                console.error("Fel vid kontroll av gillade böcker: ", error);
            }
        }
    }

    const toggleLike = async () => {
        if (user) {
            setLoading(true);
            try {
                const method = liked ? 'DELETE' : 'POST'; // Om boken redan är gillad DELETE, är boken inte gillad POST

                const endpoint = liked ? `/${bookId}` : "";

                const body = JSON.stringify({ book_id: bookId, title: title, thumbnail: thumbnail });

                console.log(body);

                const response = await fetch(`${url}/likedbooks${endpoint}`, {
                    method: method,
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("bookToken")
                    },
                    body: method === 'POST' ? body : undefined,
                });

                if (response.ok) {
                    setLiked(!liked); //uppdatera gilla status
                    setLikeCount(likeCount + (liked ? -1 : 1)); // uppdatera antal gilla markeringar
                }
            } catch (error) {
                console.error("Fel vid gillande: ", error);
            } finally {
                setLoading(false);
            }
        }
    }

    const fetchLikes = async () => {
        try {
            const response = await fetch(`${url}/book/${bookId}/likes`, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                setError("Fel vid inläsning av gilla-markeringar");
                throw Error;
            }
            const data = await response.json();
            setLikeCount(data.likes_count || 0);
            setError('');
        } catch (error) {
            console.log("Fel vid inläsning av gilla-markeringar: " + error);
            setLikeCount(0);
        } finally {
            setLoading(false);
        }
    }

    // Hämta gillamarkeringar för bok-id
    useEffect(() => {
        fetchLikes();
    }, [bookId]);

    // Om användare inloggad, kolla om bok är bland dennes gillade böcker
    useEffect(() => {
        if (user) {
            checkIfLiked();
        }
    }, [user, bookId])

    if (loading) {
        return <SpinnerGap size={24} className='animate-spin' />
    }
    if (error) {
        return <WarningCircle size={24} className='text-coral' />
    }

    if (readonly) {
        return (
            <div className='flex justify-center items-center text-dark-soft mx-4'>
                <Heart weight='fill' size={24} className='text-coral text-opacity-50' />
                <span className='mx-2'>({likeCount})</span>
            </div>
        )
    }

    return (
        <>
            {user ? (
                <button className='flex justify-center items-center cursor-pointer' onClick={toggleLike} disabled={loading}>
                    <Heart weight={liked ? 'fill' : 'regular'} size={24} className="text-coral" />
                    <span>({likeCount})</span>
                </button>
            ) : (
                <div className='flex justify-center items-center text-dark-soft mx-4'>
                    <Heart weight='fill' size={24} className='text-coral text-opacity-50' />
                    <span className='mx-2'>({likeCount})</span>
                </div>
            )}

        </>
    )
}

export default LikeButton
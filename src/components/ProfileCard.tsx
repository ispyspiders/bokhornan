import { Link } from 'react-router-dom';
import { User } from '../types/auth.types'
import { Gear, UserCircle } from '@phosphor-icons/react';


interface ProfileCardProps {
    user: User;
    isOwnProfile: boolean;
    likedBooksCount: number,
    reviewCount: number
}


const ProfileCard: React.FC<ProfileCardProps> = ({ user, isOwnProfile, likedBooksCount, reviewCount }) => {

    return (
        <div className='bg-light rounded-lg p-4 my-12 mx-auto drop-shadow-sm flex flex-wrap gap-2'>
            <div>
                <div id='avatar-container'>
                    {user.avatar_file ? (
                        <img src={user.avatar_url} alt="" />
                    ) : (
                        <div className='bg-blush-light rounded flex justify-center items-center w-56 h-56'>
                            <UserCircle size={200} weight='duotone' className='text-blush-deep' />
                        </div>
                    )}
                </div>
                {/* Namn & email */}
                <div className='border-b border-blush-mid my-4 text-dark-soft'>
                    <h3 className='text-xl'>{user.name}</h3>
                    <p className='font-montserrat text-sm '>{user.email}</p>
                </div>
                {/* Antal recensioner och gillade böcker  */}
                <div className='flex gap-8'>
                    <div className='flex flex-col font-montserrat'>
                        <span className='font-semibold'>{reviewCount}</span>
                        recensioner
                    </div>
                    <div className='flex flex-col font-montserrat'>
                        <span className='font-semibold'>{likedBooksCount}</span>
                        gillade böcker
                    </div>
                </div>
            </div>

            <div>
                <p>{user.bio}</p>
                <p>{user.current_read}</p>

                {isOwnProfile && (
                    <div className='flex items-end justify-end w-full'>
                        <Link to={"/profile/edit"}
                            className='bg-blush-deep ps-8 pe-4 py-2 rounded-lg flex mx-auto drop-shadow-sm hover:bg-blush-mid tracking-wider'
                        >
                            Redigera profil
                            <Gear size={24} className='ms-2' />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProfileCard
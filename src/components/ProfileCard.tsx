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
        <div className='bg-light rounded-lg p-4 mx-auto drop-shadow-sm grid sm:grid-cols-2 md:flex gap-8'>
            <div className='w-full max-w-64 min-w-64'>
                <div id='avatar-container'>
                    {user.avatar_url ? (
                        <img src={user.avatar_url} alt="Avatar" className='w-56 h-56 object-cover'/>
                    ) : (
                        <div className='bg-blush-light rounded flex justify-center items-center w-56 h-56'>
                            <UserCircle size={200} weight='duotone' className='text-blush-deep' />
                        </div>
                    )}
                </div>
                {/* Namn & email & läser nu */}
                <div className='border-b border-blush-mid my-4 text-dark-soft'>
                    <h3 className='text-xl'>{user.name}</h3>
                    <p className='font-montserrat text-sm '>{user.email}</p>
                    <p className='font-montserrat text-sm text-dark'><span className='font-medium'>Läser just nu: </span>{user.current_read}</p>

                </div>
                {/* Antal recensioner och gillade böcker  */}
                <div className='flex gap-8 border-b pb-4 border-blush-mid sm:border-0'>
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

            <div className='flex flex-col justify-between items-start md:col-span-2 '>
                {/* Bio */}
                <div className='max-w-56 sm:max-w-none sm:flex flex-col justify-center items-center h-full'>
                <p className='text-lg mt-4'>{user.bio}</p>
                </div>

                {isOwnProfile && (
                    <div className='flex items-end justify-end w-full'>
                        <Link to={"/profile/edit"}
                            className='bg-blush-deep ps-8 pe-4 py-2 my-4 rounded-lg flex drop-shadow-sm hover:bg-blush-mid tracking-wider'
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
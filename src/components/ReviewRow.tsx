import { Link } from "react-router-dom"
import { Review } from "../types/review.types"
import StarRating from "./StarRating"
import { LineVertical } from "@phosphor-icons/react"
import { useAuth } from "../context/AuthContext"

interface ReviewRowProps {
    review: Review,
    onDeleteRequest: (id: string) => void
}
const ReviewRow: React.FC<ReviewRowProps> = ({ review, onDeleteRequest }) => {

    const { user } = useAuth();

    const isOwnProfile = user?.id == review.user_id; // Kollar om det är ens egen profil


    return (
        <tr key={review.id} className='bg-light w-full border-b border-blush-mid'>
            <td><Link to={`/book/${review.book_id}`} className="hover:underline font-medium">{review.book_title}</Link></td>
            <td>{review.created_at.slice(0, 10)}</td>
            {/* Visa siffra för rating på små skärmar */}
            <td className="sm:hidden">{review.rating} / 5</td>
            {/* Visa starrating för större skärmar */}
            <td className="hidden sm:table-cell ">
                <StarRating rating={review.rating} readonly={true} size={24} />
            </td>
            <td>
                { (isOwnProfile || user?.is_admin ) &&
                    <div className="flex justify-center items-center me-2">

                        <Link to={`/review/${review.id}`} className="font-semibold text-dark-soft hover:underline">Redigera</Link>
                        <LineVertical size={24} className="text-blush-mid" />
                        <button type="button" className="font-semibold text-red-800 hover:underline" onClick={() => onDeleteRequest(review.id)}>Radera</button>
                    </div>
                }
            </td>
        </tr>
    )
}

export default ReviewRow
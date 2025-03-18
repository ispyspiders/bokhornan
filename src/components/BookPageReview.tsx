import { Link } from "react-router-dom"
import { Review } from "../types/review.types"
import StarRating from "./StarRating"

interface BookPageReviewProps {
    review: Review
}

const BookPageReview = ({ review }: BookPageReviewProps) => {
    return (
        <div className="bg-light rounded p-4 mb-4 mx-auto drop-shadow-sm">
            <div className="sm:flex justify-between border-b border-blush-mid pb-4 mb-4 ps-2">

            {/* Namn och publicerad */}
            <h4 className="font-serif font-bold mb-2 sm:mb-0">
            <Link to={`/profile/${review.user_id}`} className="hover:underline">{review.user_name}</Link>
                <span className="font-normal">, {review.created_at.slice(0, 10)}</span>
            </h4>
            {/* Betyg/Stärnor */}
            <StarRating readonly={true} rating={review.rating} size={28}/>
            </div>
            <p className="ms-4">{review.comment}</p>
        </div>
    )
}

export default BookPageReview
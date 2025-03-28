import { Link } from "react-router-dom"
import { Review } from "../types/review.types"
import StarRating from "./StarRating"

interface ReviewCardProps {
    review: Review
}

const ReviewCard = ({ review }: ReviewCardProps) => {
    return (
        <div className="bg-light rounded-lg p-4 drop-shadow-sm border-2 border-blush-deep font-montserrat h-full flex flex-col justify-between">
            <div>

                <StarRating readonly={true} rating={review.rating} size={32} />
                <Link to={`/book/${review.book_id}`}>
                    <h4 className=" text-lg font-semibold my-2 text-ellipsis line-clamp-2 hover:underline">{review.book_title}</h4>
                </Link>

                <p className="text-ellipsis line-clamp-3 max-w-96">{review.comment}</p>
            </div>

            <span className="text-sm text-dark-soft uppercase tracking-wider">
                <Link to={`/profile/${review.user_id}`} className="font-semibold hover:underline">{review.user_name}</Link>
                , {review.created_at.slice(0, 10)}
            </span>

        </div>
    )
}

export default ReviewCard
import { Link } from "react-router-dom"
import LikeButton from "./LikeButton"

interface LikedBookCardProps {
    thumbnail: string
    title: string,
    bookId: string,
    readonly: boolean
}

const LikedBookCard = ({ thumbnail, title, bookId, readonly }: LikedBookCardProps) => {

    return (
        <div className="bg-light rounded-lg p-4 drop-shadow-sm w-fit border-2 border-blush-deep font-montserrat w-40">
            <img src={thumbnail} alt="Bookcover" />
            <Link to={`/book/${bookId}`}>
                <h4 className="font-semibold my-2 text-ellipsis line-clamp-2 hover:underline">{title}</h4>
            </Link>
            <LikeButton bookId={bookId} title={title} thumbnail={thumbnail} readonly={readonly} />
        </div>
    )
}

export default LikedBookCard
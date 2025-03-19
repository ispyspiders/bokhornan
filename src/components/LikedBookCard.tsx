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
        <div className="bg-light rounded-lg p-4 drop-shadow-sm w-fit border-2 border-blush-deep font-montserrat max-w-40 w-40 flex flex-col justify-between items-start">
            <div className="w-full">
                <div className="min-h-32">
                <img src={thumbnail} alt="Bookcover" className="max-h-32 mx-auto" />

                </div>
                <Link to={`/book/${bookId}`}>
                    <h4 className="font-semibold my-2 break-words text-ellipsis line-clamp-2 hover:underline min-h-[3em]">{title}</h4>
                </Link>
            </div>
            <LikeButton bookId={bookId} title={title} thumbnail={thumbnail} readonly={readonly} />
        </div>
    )
}

export default LikedBookCard
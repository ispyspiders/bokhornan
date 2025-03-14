import { Star } from "@phosphor-icons/react";
import { useState } from "react";

interface StarRatingProps {
    onRatingChange: (rating: number) => void,
    rating: number
}

const StarRating: React.FC<StarRatingProps> = ({ onRatingChange, rating }) => {
    // const [rating, setRating] = useState(0); // betyg (1-5)

    const handleClick = (newRating: number) => {
        // setRating(newRating);
        onRatingChange(newRating); // Skicka betyg till förälder
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star weight="fill" size={24} key={i} onClick={() => handleClick(i)} className={`cursor-pointer me-2 ${i <= rating ? 'text-coral' : 'text-blush-mid'}`} />
            );
        }
        return stars;
    };

    return (
        <div className="flex">
            {renderStars()}
        </div>
    )
}

export default StarRating
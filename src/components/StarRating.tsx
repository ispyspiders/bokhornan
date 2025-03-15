import { Star } from "@phosphor-icons/react";
import { useState } from "react";

interface StarRatingProps {
    onRatingChange?: (rating: number) => void,
    rating: number,
    readonly?: boolean,
    size: number
}

const StarRating: React.FC<StarRatingProps> = ({ onRatingChange, rating, readonly, size }) => {
    const [hovered, setHovered] = useState<number | null>(null);

    const handleMouseEnter = (index: number) => {
        if (!readonly) {
            setHovered(index);
        }
    }

    const handleMouseLeave = () => {
        if (!readonly) {
            setHovered(null);
        }
    }

    const handleClick = (newRating: number) => {
        if (!readonly && onRatingChange) {
            onRatingChange(newRating); // Skicka betyg till förälder
        }
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star 
                    weight="fill" 
                    size={size} 
                    key={i} 
                    onClick={() => handleClick(i)} 
                    onMouseEnter={()=> handleMouseEnter(i+1)}
                    onMouseLeave={handleMouseLeave}
                    className={`${readonly ? 'cursor-default':'cursor-pointer'} me-2 ${i <= rating ? 'text-coral' : 'text-blush-mid'}`} 
                    />
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
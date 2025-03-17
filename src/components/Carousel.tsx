import React, { useState } from 'react';
import ReviewCard from './ReviewCard'; // Importera ReviewCard-komponenten
import { Review } from '../types/review.types'; // Importera Review-typen
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

interface CarouselProps {
  reviews: Review[];  // Carousel-komponenten tar en lista av recensioner som prop
}

const Carousel: React.FC<CarouselProps> = ({ reviews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
  };

  return (
    <div className="relative w-full max-w-full mx-auto bg-coral py-4">
      <div className="overflow-hidden relative">
        {/* Rendera varje recension som ett ReviewCard */}
        <div
          className="flex transition-transform duration-500 ease-in-out gap-4"
          style={{ transform: `translateX(-${(currentIndex) * (100 / 1.5)}%)` }}
        >
          {reviews.map((review, index) => (
            <div
              key={review.id}  // Se till att varje slide har en unik key (använd review.id här)
              className={`flex-shrink-0 ${index === 0 ? 'ms-12' : ''} ${
                index === reviews.length - 1
                  ? 'w-[calc(100%/1.5)]' 
                  : 'w-[calc(100%/1.5)]' // Alla mellanliggande kort får bredden
              }`}
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>

      <button
        className="absolute top-1/2 left-0 transform -translate-y-1/2 h-full w-10 bg-blush-light bg-opacity-60 text-coral p-2 hover:bg-opacity-80"
        onClick={prevSlide}
      >
        <CaretLeft size={24} />
      </button>
      <button
        className="absolute top-1/2 right-0 transform -translate-y-1/2 h-full w-10 bg-blush-light bg-opacity-60 text-coral p-2 hover:bg-opacity-80"
        onClick={nextSlide}
      >
        <CaretRight size={24} />
      </button>
    </div>
  );
};

export default Carousel;

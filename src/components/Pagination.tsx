import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import React from 'react'

interface PaginationProps {
    startIndex: number,
    totalItems: number,
    maxResults: number,
    onPrevious: () => void,
    onNext: () => void,
}

const Pagination: React.FC<PaginationProps> = ({ startIndex, totalItems, maxResults, onPrevious, onNext }) => {

    // Beräkna intervallet som visas för nuvarande sida
    const from = startIndex +1;
    const to = Math.min(startIndex+maxResults, totalItems); // visa max "totalitems" på sista sidan

    return (
        <div className='w-full mt-4 bg-light flex items-center justify-between rounded-lg text-sm gap-4 mb-2'>
            <button onClick={onPrevious} disabled={startIndex === 0} className='flex rounded-s-lg py-2 m-0 ps-4 pe-8 border border-e-0 border-blush-mid drop-shadow-sm bg-blush-deep text-sm'>
                <CaretLeft size={24} className='' />
                
            </button>
            <span>
                Visar resultat {from} - {to} av {totalItems}
            </span>
            <button onClick={onNext} disabled={startIndex + maxResults >= totalItems} className='flex rounded-e-lg py-2 m-0 ps-4 pe-8 border border-s-0 border-blush-mid drop-shadow-sm bg-blush-deep text-sm'>
                <CaretRight size={24} />
            </button>
        </div>
    )
}

export default Pagination
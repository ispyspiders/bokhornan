import { MagnifyingGlass } from '@phosphor-icons/react'
import React from 'react'

interface SearchFormProps {
    searchTerm: string,
    error: string,
    onSubmit: (e:React.FormEvent<HTMLFormElement>) => void,
    onSearchChange: (e:React.ChangeEvent<HTMLInputElement>) => void

}

const SearchForm: React.FC<SearchFormProps> = ({ searchTerm, onSubmit, onSearchChange, error }) => {
    

    return (
        <form onSubmit={onSubmit} className='flex items-baseline my-8'>
            <div className='w-full'>

                <input
                    type="text"
                    id='search'
                    value={searchTerm}
                    placeholder='Sök efter titel, författare eller genre... '
                    onChange={onSearchChange}
                    className="text-md p-2 w-full rounded-s-md border border-e-0 border-blush-mid drop-shadow-sm focus:outline-blush-deep"
                />
                {error && <span className="text-sm font-light mt-2 ms-2 text-red-500 w-full">{error}</span>}
            </div>

            <button className='rounded-s-none m-0 ps-6 border border-s-0 border-blush-mid drop-shadow-sm'>
                <span className='me-2'>Sök</span>
                <MagnifyingGlass size={24} />
            </button>
        </form>)
}

export default SearchForm
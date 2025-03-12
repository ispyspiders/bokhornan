import { NavLink } from "react-router-dom"

const Header = () => {
    return (
        <header className="bg-blush-deep bg-books h-60 flex items-center justify-center">
            <div className="bg-light bg-opacity-75 p-4 m-4 w-full sm:w-4/5 max-w-5xl h-full flex justify-center items-center">
                <h1 className="font-display text-dark-soft text-5xl text-center md:text-6xl">Bokhörnan</h1>
            </div>
        </header>
    )
}

export default Header
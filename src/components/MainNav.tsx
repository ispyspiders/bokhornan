import { NavLink } from "react-router-dom"
import { ArrowLeft, BookBookmark, BookOpen, Books, CaretDown, CaretUp, HouseLine, List, SignIn, UserCircle } from "@phosphor-icons/react"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "../context/AuthContext"

const MainNav = () => {
    // States
    const [showMenu, setShowMenu] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const menuRef = useRef<HTMLUListElement|null>(null);

    useEffect(()=> {
        // Hantera klick utanför dropdownmenu: stäng dropdown
        const handler = (event:MouseEvent|TouchEvent) => {
            if (
                showDropdown &&
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        document.addEventListener("touchstart", handler);
        return () =>{
            document.removeEventListener("mousedown", handler);
            document.removeEventListener("touchstart", handler);
        };
    }, [showDropdown]);

    const { user, logout } = useAuth();

    const toggleMobileMenu = () => {
        setShowMenu(!showMenu);
    }
    const toggleDropdownMenu = () => {
        setShowDropdown(!showDropdown);
    }

    return <>
        <div className={`flex flex-col-reverse justify-center fixed top-0 start-0 end-14 bottom-16 z-10  bg-blush-light  drop-shadow 
        md:static md:w-4/5 md:mx-auto md:max-w-5xl md:flex-row md:bg-blush-deep md:justify-between  ${showMenu ? '' : 'hidden md:flex'}`}>

            <ul className={`flex flex-col justify-center p-16 md:flex-row md:justify-start md:p-2 md:ps-4 ${showMenu ? '' : 'hidden md:flex'}`}>
                <li className="my-2 text-xl font-light md:me-8 md:text-base">
                    <NavLink to="/" onClick={toggleMobileMenu} className="hover:text-coral-vivid">
                        <span className="flex items-center">
                            <HouseLine size={24} className="me-2 md:hidden" />
                            Startsida
                        </span>
                    </NavLink>
                </li>
                <li className="my-2 text-xl font-light md:me-8 md:text-base">
                    <NavLink to="/books" onClick={toggleMobileMenu} className="hover:text-coral-vivid">
                        <span className="flex items-center">
                            <Books size={24} className="me-2 md:hidden" />
                            Böcker
                        </span>
                    </NavLink>
                </li>
                <li className="my-2 text-xl font-light md:me-8 md:text-base">
                    <NavLink to="/about" onClick={toggleMobileMenu} className="hover:text-coral-vivid">
                        <span className="flex items-center">
                            <BookOpen size={24} className="me-2 md:hidden" />
                            Om oss
                        </span>
                    </NavLink>
                </li>
            </ul >

            <div className="h-px w-4/5 mx-auto mt-4 bg-blush-mid md:hidden"></div>

            {
                !user ?
                    <div className="flex content-center justify-start items-center px-16 md:px-8 text-xl md:text-base">
                        <NavLink to="/login" onClick={toggleMobileMenu} className="hover:text-coral-vivid">
                            <span className="flex items-center">
                                <SignIn size={24} className="me-2 md:hidden " />
                                Logga in
                            </span>
                        </NavLink>
                    </div>
                    :
                    <div className="grid grid-cols-3 items-center px-11 md:pe-4 md:ps-0 text-sm md:flex">
                        {/* Inloggad användare i meny */}
                        {/* Som text för små skärmar */}
                        <div className="my-2 ms-4 text-xl col-span-2  md:hidden">
                            <span className="flex items-center">
                                <UserCircle size={24} className="me-2" />
                                {user.name}
                                <CaretDown weight="fill" size={14} className="hidden ms-2 md:block" />
                            </span>
                        </div>
                        {/* Som knapp som togglar dropdown för medelstora skärmar och uppåt */}
                        <button onClick={toggleDropdownMenu} id="dropdown-button" aria-controls="dropdown-menu" aria-haspopup="true" aria-expanded={showDropdown} className="hidden my-2 ms-4 text-xl col-span-2 md:block  md:me-4 md:text-base">
                            <span className="flex items-center">
                                <UserCircle size={24} className="me-2" />
                                {user.name}
                                {/* Caret upp eller ned beroende på om öppen */}
                                {showDropdown ?
                                    <CaretUp weight="fill" size={14} className="hidden ms-2 md:block" />
                                    :
                                    <CaretDown weight="fill" size={14} className="hidden ms-2 md:block" />
                                }
                            </span>
                        </button>


                        {/* Logga ut */}
                        <div className="flex items-center mt-2 row-span-all md:mt-0">
                            <p className="pe-2 text-sm font-light">Inte du?</p>
                            <button onClick={logout} className="text-sm font-normal hover:text-coral-vivid">Logga ut</button>
                        </div>

                        <div className="h-px w-full mx-auto mt-4 bg-blush-mid col-span-full md:hidden"></div>

                        {/* md: Dropdown */}
                        <ul ref={menuRef} id="userDropdown" role="menu" aria-labelledby="dropdown-button" className={`col-span-2 ms-4 text-xl font-light
                        md:bg-light md:rounded-md md:border-2 md:border-blush-mid md:absolute md:top-16 md:py-2 ${showDropdown ? '' : 'md:hidden'}`}>
                            <li className="md:px-4 md:py-2 md:hover:bg-blush-mid">
                                <NavLink to="/profile" onClick={() => { toggleMobileMenu; toggleDropdownMenu }} className="hover:text-coral-vivid md:hover:text-dark">
                                    <span className="flex items-center mt-4 md:mt-0">
                                        <UserCircle size={24} className="me-2" />
                                        Min profil
                                    </span>
                                </NavLink>
                            </li>
                            <li className="md:px-4 md:py-2 md:hover:bg-blush-mid">
                                <NavLink to="/likedbooks" onClick={() => { toggleMobileMenu; toggleDropdownMenu }} className="hover:text-coral-vivid md:hover:text-dark">
                                    <span className="flex items-center mt-4 md:mt-0">
                                        <BookBookmark size={24} className="me-2" />
                                        Gillade böcker
                                    </span>
                                </NavLink>
                            </li>
                        </ul>
                    </div>

            }

        </div >

        <div className="fixed inset-x-0 bottom-0 h-16 bg-blush-deep flex p-2 ps-12 z-10 md:hidden">
            <button onClick={toggleMobileMenu}>{!showMenu && <List />}{showMenu && <ArrowLeft />}</button>
        </div>
    </>
}

export default MainNav

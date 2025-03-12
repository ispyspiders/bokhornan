import { NavLink } from "react-router-dom"
import { ArrowLeft, HouseLine, List, SignIn, UserCircle } from "@phosphor-icons/react"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"

const MainNav = () => {
    // States
    const [showMenu, setShowMenu] = useState(false);

    const { user, logout } = useAuth();

    const toggleMobileMenu = () => {
        setShowMenu(!showMenu);
    }

    return <>
        <div className={`flex flex-col-reverse justify-center fixed top-0 start-0 end-14 bottom-16 z-10  bg-blush-light  drop-shadow 
        md:static md:w-4/5 md:mx-auto md:max-w-5xl md:flex-row md:bg-blush-deep md:justify-between  ${showMenu ? '' : 'hidden md:flex'}`}>

            <ul className={`flex flex-col justify-center p-16 md:flex-row md:justify-start md:p-2 md:px-8 ${showMenu ? '' : 'hidden md:flex'}`}>
                <li className="my-2 text-xl font-light md:me-8 md:text-base">
                    <NavLink to="/" onClick={toggleMobileMenu} className="hover:text-coral-vivid">
                        <span className="flex items-center">
                            <HouseLine size={24} className="me-2 md:hidden" />
                            Startsida
                        </span>
                    </NavLink>
                </li>
            </ul >
<div className="h-px w-4/5 mx-auto mt-4 bg-blush-mid md:hidden">
</div>
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
                    <div className="flex content-center justify-between items-center px-16 md:px-8 text-sm">
                        <div className="my-2 text-xl md:me-4 md:text-base">
                            <NavLink to="/profile" onClick={toggleMobileMenu} className="hover:text-coral-vivid">
                                <span className="flex items-center">
                                    <UserCircle size={24} className="me-2" />
                                    {user.name}
                                </span>
                            </NavLink>
                        </div>
                        <div className="flex items-center">
                            <p className="pe-2 text-sm font-light">Inte du?</p>
                            <button onClick={logout} className="text-sm font-normal hover:text-coral-vivid">Logga ut</button>
                        </div>
                    </div>
            }

        </div >

        <div className="fixed inset-x-0 bottom-0 h-16 bg-blush-deep flex p-2 ps-12 z-10 md:hidden">
            <button onClick={toggleMobileMenu}>{!showMenu && <List />}{showMenu && <ArrowLeft />}</button>
        </div>
    </>
}

export default MainNav

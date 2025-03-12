import Header from "./Header"
import MainNav from "./MainNav"
import { Outlet } from "react-router-dom"

const Layout = () => {
    return (
        <>
            <Header />
            <MainNav />
            <main>
                <Outlet />
            </main>
            <footer className="bg-blue-deep text-light text-center text-sm p-2 mb-16 md:mb-0">Projektuppgift i kursen Fördjupad frontendutveckling skapad av <a className="text-dust-light hover:underline" href="mailto:kacl1200@student.miun.se">Kajsa Classon</a>, VT25.</footer>
        </>
    )
}

export default Layout
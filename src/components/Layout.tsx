import Header from "./Header"
import MainNav from "./MainNav"
import { Outlet } from "react-router-dom"

const Layout = () => {
    return (
        <>
            <Header />

            <MainNav />

            <main className="bg-blush-light mx-4 pb-4 pt-12 sm:w-4/5 sm:mx-auto max-w-5xl ">
                <Outlet />
            </main>
            <footer className="bg-blush-deep border-b border-blush-mid text-center font-serif text-sm p-2 mb-16 md:mb-0">Projektuppgift i kursen Fördjupad frontendutveckling skapad av <a className="font-bold hover:underline" href="mailto:kacl1200@student.miun.se">Kajsa Classon</a>, VT25.</footer>
        </>
    )
}

export default Layout
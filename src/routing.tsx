import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BooksPage from "./pages/BooksPage";
import BookPage from "./pages/BookPage";
import AboutPage from "./pages/AboutPage";
import SearchPage from "./pages/SearchPage";
import EditProfilePage from "./pages/EditProfilePage";
import ReviewPage from "./pages/ReviewPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <HomePage />
            },
            {
                path: "/login",
                element: <LoginPage />
            },
            {
                path: "/register",
                element: <RegisterPage />
            },
            {
                path: "/books",
                element: <BooksPage />
            },
            {
                path: "/book/:bookid",
                element: <BookPage />
            },
            {
                path: "/search/:searchTerm",
                element: <SearchPage />
            },
            {
                path: "/about",
                element: <AboutPage />
            },
            {
                path: "/profile/:userId",
                element: (
                    <ProfilePage />

                )
            },
            {
                path: "/profile/edit",
                element: (
                    <ProtectedRoute>
                        <EditProfilePage />
                    </ProtectedRoute>
                )
            },
            {
                path: "/review/:reviewId",
                element: (
                    <ProtectedRoute>
                        <ReviewPage />
                    </ProtectedRoute>
                )
            },
        ]
    },
])

export default router;

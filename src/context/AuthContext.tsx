import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { User, LoginCredentials, AuthResponse, AuthContextType, url, RegistrationInfo } from "../types/auth.types";


// skapa context
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // Logga in
    const login = async (credentials: LoginCredentials) => {
        try {
            const res = await fetch(url + "/login", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credentials)
            })
            if (!res.ok) throw new Error("Inloggning misslyckades!");

            const data = await res.json() as AuthResponse;
            console.log(data);
            localStorage.setItem('bookToken', data.token);
            setUser(data.user);
        } catch (error) {
            throw error;
        }
    }

    // Logga ut
    const logout = async () => {
        try {
            const response = await fetch(url + "/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("bookToken")
                },
            })
            if (!response.ok) throw new Error("Fel vid utlogging");

            // Ta bort token ur localstorage och nollställ user-state
            localStorage.removeItem("bookToken");
            setUser(null);
        } catch (error) {
            throw error;
        }
    }

    // Validera token
    const checkToken = async () => {
        const token = localStorage.getItem("bookToken");
        if (!token) {
            console.log("token saknas");
            return;
        }

        try {
            const res = await fetch(url + "/user", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
            }
        } catch (error) {
            console.error("Error in checkToken:", error);
            localStorage.removeItem("bookToken");
            setUser(null);
        }
    }

    // registrera användare
    const register = async (userInfo: RegistrationInfo) => {
        try {
            const res = await fetch(url + "/register", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userInfo)
            });
            if (!res.ok) throw new Error("Registrering misslyckades!");
            const data = await res.json() as AuthResponse;
            console.log(data);
            localStorage.setItem('bookToken', data.token);
            setUser(data.user);
        } catch (error) {
            throw error;
        }

    }

    // Uppdatera användardata
    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
    }

    // Kontrollera om admin
    const checkIfAdmin = () => {
        return user?.is_admin === 1
    }

    useEffect(() => {
        checkToken();
        checkIfAdmin();
    }, []);


    return (
        <AuthContext.Provider value={{ user, login, logout, register, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (!context) throw new Error("useAuth måste användas inom en AuthProvider");
    return context;
}
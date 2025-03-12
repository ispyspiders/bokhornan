export interface User {
    id: string,
    name: string,
    email: string,
    is_admin: boolean,
    bio: string,
    current_read: string,
    avatar_file: string,
    avatar_url: string,
    created_at: string,
    updated_at: string
}

export interface LoginCredentials {
    email: string,
    password: string
}

export interface AuthResponse {
    user: User,
    token: string
}

export interface RegistrationInfo {
    name: string,
    email: string,
    password: string
}

export interface AuthContextType{
    user: User | null,
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    register: (userInfo: RegistrationInfo) => Promise<void>;
}

export const url = "https://bokhornan-service.azurewebsites.net/api"
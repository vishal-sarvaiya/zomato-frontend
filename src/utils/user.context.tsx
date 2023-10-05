import { ReactNode, createContext, useContext } from "react";

interface UserData {
    isLoggedIn: string;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<string>>;
    token: string;
    setToken: React.Dispatch<React.SetStateAction<string>>;
    role: string;
    setRole: React.Dispatch<React.SetStateAction<string>>;
    userName: string;
    setUserName: React.Dispatch<React.SetStateAction<string>>;
    firstTimeLogin: string;
};

export const UserContext = createContext<UserData>({
    isLoggedIn: "",
    setIsLoggedIn: () => { },
    token: "",
    setToken: () => { },
    role: "",
    setRole: () => { },
    userName: "",
    setUserName: () => { },
    firstTimeLogin: ""
})

interface UserProviderProps extends UserData {
    children: ReactNode
}

export const UserProvider = ({ children, ...props }: UserProviderProps) => {
    return (
        <UserContext.Provider value={props}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)
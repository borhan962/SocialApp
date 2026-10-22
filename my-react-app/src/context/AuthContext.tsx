import {createContext , type ReactNode , useState} from 'react';



type AuthContextType = {
    userToken:string | null;
    setToken:React.Dispatch<React.SetStateAction<string | null>>;
}

export const AuthContext = createContext<AuthContextType | null>(
    {
        userToken:"",
        setToken:()=>undefined
    }
);


export default function AuthProvider({children}: {children:ReactNode}) {

    const [userToken , setToken] = useState<string | null>(()=>{
        return localStorage.getItem("token")
         
    })


    return (
        <AuthContext.Provider value={{userToken , setToken}}>
            {children}
        </AuthContext.Provider>
    )

}

import { createContext , type ReactNode , useContext, useEffect, useState } from 'react'
import { getUserData } from '../Services/userprofile.services'
import { AuthContext } from "../context/AuthContext";

type userTypeContext =  {
    userData : any
    setUserData : React.Dispatch<React.SetStateAction<any>>
}

export const userDataContext = createContext<userTypeContext>({
    userData : null,
    setUserData: () => undefined
})

export default function UserDataProvider({children}: {children:ReactNode}) {
    const [ userData , setUserData] = useState<any>(null)
    const {userToken} = useContext(AuthContext)


    async function getData(){
        const res = await getUserData(userToken!)
        setUserData(res)
    }

    useEffect(() => {
        if(userToken){
            getData()
        }
    }, [userToken])
    
  return (
    <userDataContext.Provider value={{userData , setUserData}}>
        {children}
    </userDataContext.Provider>
  )
}

import { useState, createContext, SetStateAction, Dispatch, FunctionComponent } from "react";
import { CurrentUserContextType, IUser } from '../@types/user';

// interface SetCurrentUser {
//     setUser: Dispatch<SetStateAction<CurrentUserContextType>>;
// }

export const UserContext = createContext<CurrentUserContextType | null>(null);
// const UserDispatchContext = createContext<SetCurrentUser | null>(null);

function UserProvider({ children }: { children: React.ReactNode }) {
    
    const [users, setUser] = useState<IUser[]>([
        {
            firstname: "",
            lastname: "",
            email: "",
            userId: "",
            // inviteId: ""
        }
    ])

    const saveUser = (user: IUser) => {
        const newUser: IUser = {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            userId: user.userId,
            // inviteId: user.inviteId
        }
        setUser([...users, newUser])
    }
    return (
        <UserContext.Provider value={{users, saveUser}}>{children}</UserContext.Provider>
    )

}

export default UserProvider

// function UserProvider({ children }: { children: React.ReactNode }) {
//     const [userDetails, setUserDetails] = useState<CurrentUserContextType>({
//         firstname: "",
//         lastname: "",
//         email: "",
//         userId: "",
//         inviteid: "",
//     });
//     return ( 
//     <UserContext.Provider value={userDetails}>
//         <UserDispatchContext.Provider value={{ setUser: setUserDetails }}>
//             {children}
//         </UserDispatchContext.Provider>
//     </UserContext.Provider>
//      );
// }

// export { UserProvider, UserContext, UserDispatchContext };
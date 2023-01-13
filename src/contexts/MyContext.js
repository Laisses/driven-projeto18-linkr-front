import React, {createContext, useState} from "react";

export const MyContext = createContext ({})

function MyContextProvider ({children}) {
    const dataObjStringyfied = localStorage.getItem("data");

    const [counter, setCounter] = useState(0);
    const [token, setToken] = useState(localStorage.getItem("token"))
    const [data, setData] = useState(JSON.parse(dataObjStringyfied))
    const [followingIds, setFollowingIds] = useState([])

    const config = { headers: { Authorization: `Bearer ${token}`}};

    return (
        <MyContext.Provider value={{token, config, counter, setCounter, data, setToken, setData, followingIds, setFollowingIds}}>
            {children}
        </MyContext.Provider>
    )
}

export default MyContextProvider

import React, {createContext, useState} from "react";

export const MyContext = createContext ({})

function MyContextProvider ({children}) {
    const dataObjStringyfied = localStorage.getItem("data");

    const [counter, setCounter] = useState(0);
    const [token, setToken] = useState(localStorage.getItem("token"))
    const [data, setData] = useState({user: {photo: ''}})
    JSON.parse(dataObjStringyfied)

    const config = { headers: { Authorization: `Bearer ${token}`}};

    return (
        <MyContext.Provider value={{token, config, counter, setCounter, data, setToken, setData}}>
            {children}
        </MyContext.Provider>
    )
}

export default MyContextProvider
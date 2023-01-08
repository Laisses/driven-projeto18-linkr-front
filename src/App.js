import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalStyle from "./assets/styles/GlobalStyle";
import { Timeline } from './pages/Timeline';
import HashtagPage from './pages/hashtag';
import SignIn from './pages/SignIn.js'
import SignUp from './pages/SignUp.js'
import MyContext from './contexts/MyContext';
import { useState } from 'react';

export default function App() {
    const [counter, setCounter] = useState(0);
    const [token, setToken] = useState(localStorage.getItem("token"))

    const config = { headers: { Authorization: `Bearer ${token}`}};
    
    const dataObjStringyfied = localStorage.getItem("data");
    const data = JSON.parse(dataObjStringyfied)

    return (
        <MyContext.Provider value={{token, config, counter, setCounter, data, setToken}}>

        <BrowserRouter>
            <GlobalStyle />
                <Routes>
                    <Route path="/" element={<SignIn />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/timeline" element={<Timeline />} />
                    <Route path="/hashtag/:hashtag" element={<HashtagPage />} />
                </Routes>
        </BrowserRouter>
        </MyContext.Provider>
    );
}

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalStyle from "./assets/styles/GlobalStyle";
import { Timeline } from './pages/Timeline';
import HashtagPage from './pages/hashtag';
import { useState } from 'react';
import SignIn from './components/SignIn.js'
import SignUp from './components/SignUp.js'
import UserContext from './contexts/userContext';
import MyContext from './contexts/MyContext';
import { useState } from 'react';

export default function App() {
    const [data, setData] = useState('')
    const [counter, setCounter] = useState(0)
    const [token, setToken] = useState("");
    const [user, setUser] = useState("");
    const config = { headers: { Authorization: `Bearer d0a796bd-aed5-413b-babe-00a21d083c4b`}};

    return (
        <MyContext.Provider value={{token, setToken, user, setUser, config, counter, setCounter}}>

        <BrowserRouter>
            <GlobalStyle />
            <UserContext.Provider value={{ data, setData }}>
                <Routes>
                    <Route path="/" element={<SignIn />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/timeline" element={<Timeline />} />
                    <Route path="/hashtag/:hashtag" element={<HashtagPage />} />
                </Routes>
            </UserContext.Provider>
        </BrowserRouter>
        </MyContext.Provider>
    );
}
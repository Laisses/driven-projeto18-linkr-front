import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalStyle from "./assets/styles/GlobalStyle";
import { Timeline } from './pages/Timeline';
import HashtagPage from './pages/hashtag';
import SignIn from './pages/SignIn.js'
import SignUp from './pages/SignUp.js'
import UserContext from './contexts/userContext';
import MyContext from './contexts/MyContext';
import { useState } from 'react';

export default function App() {
    const [data, setData] = useState('');
    const [counter, setCounter] = useState(0);
    const [user, setUser] = useState("");

    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}`}};

    return (
        <MyContext.Provider value={{token, user, setUser, config, counter, setCounter, data, setData}}>

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

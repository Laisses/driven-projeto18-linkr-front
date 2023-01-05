import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalStyle from "./assets/styles/GlobalStyle";
import { Timeline } from './pages/Timeline';
import HashtagPage from './pages/hashtag';
import MyContext from './components/MyContext';
import { useState } from 'react';

export default function App() {
    const [token, setToken] = useState("");
    const [user, setUser] = useState("");

    return (
        <MyContext.Provider value={{token, setToken, user, setUser}}>
        <BrowserRouter>
            <GlobalStyle />
            <Routes>
                <Route path="/" element={"olá"} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/hashtag/:hashtag" element={<HashtagPage/>}/>
                </Routes>
        </BrowserRouter>
        </MyContext.Provider>
    );
}
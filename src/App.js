import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalStyle from "./assets/styles/GlobalStyle";
import { Timeline } from './components/Timeline';
import HashtagPage from './pages/hashtag';
import { useState } from 'react';
import SignIn from './components/SignIn.js'
import SignUp from './components/SignUp.js'
import UserContext from './contexts/userContext';

export default function App() {

    const [data, setData] = useState('')

    return (
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
    )
}
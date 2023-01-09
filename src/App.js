import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalStyle from "./assets/styles/GlobalStyle";
import { Timeline } from './pages/Timeline';
import { HashtagPage } from './pages/hashtag';
import SignIn from './pages/SignIn.js'
import SignUp from './pages/SignUp.js'
import MyContextProvider from './contexts/MyContext';

export default function App() {
    return (
        <BrowserRouter>
            <GlobalStyle />
            <MyContextProvider>
                <Routes>
                    <Route path="/" element={<SignIn />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/timeline" element={<Timeline />} />
                    <Route path="/hashtag/:hashtag" element={<HashtagPage />} />
                </Routes>
            </MyContextProvider>
        </BrowserRouter>
    );
}

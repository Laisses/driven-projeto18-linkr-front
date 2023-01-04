import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalStyle from "./assets/styles/GlobalStyle";
import { Timeline } from './pages/Timeline';
import HashtagPage from './pages/hashtag';

export default function App() {
    return (
        <BrowserRouter>
            <GlobalStyle />
            <Routes>
                <Route path="/" element={"olá"} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/hashtag/:hashtag" element={<HashtagPage/>}/>
                </Routes>
        </BrowserRouter>
    );
}
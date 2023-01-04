import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalStyle from "./assets/styles/GlobalStyle";
import { Timeline } from './components/Timeline';

export default function App() {
    return (
        <BrowserRouter>
            <GlobalStyle />
            <Routes>
                <Route path="/" element={"olá"} />
                <Route path="/timeline" element={<Timeline />} />
            </Routes>
        </BrowserRouter>
    )
}
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import App from './App';
import Editor from './pages/editor/App'
import OnTheRight from './pages/on_the_right/App';

function Index() {
    return (
        <BrowserRouter basename='/MDParser'>
            <Routes>
                <Route exact path="/" element={<App />} />
                <Route path='/editor' element={<Editor />} />
                <Route path='/on_the_right' element={<OnTheRight />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Index;
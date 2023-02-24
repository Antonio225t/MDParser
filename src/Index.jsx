import { BrowserRouter, Route, Routes } from 'react-router-dom';

import App from './App';
import Editor from './pages/editor/App'
import OnTheRight from './pages/on_the_right/App';

function Index() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/MDParser" element={<App />} />
                <Route path='/MDParser/editor' element={<Editor />} />
                <Route path='/MDParser/on_the_right' element={<OnTheRight />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Index;
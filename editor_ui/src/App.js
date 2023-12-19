import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Editorpages from './pages/Editorpages';
function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home />}></Route>
                    <Route path='/editor/:roomId' element={<Editorpages />}></Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App;

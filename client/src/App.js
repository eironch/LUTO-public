import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Authentication from './pages/Authentication'

function App() {
  return (
    <div>
      {/* task: a function that checks whether the user is logged in, 
      to route them to either login page or the homepage */}
      <BrowserRouter>
        <Routes>
          {/* https://luto.com/login */}
          <Route path="/authentication" element={<Authentication/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

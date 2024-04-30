import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth'

function App() {
  return (
    <div>
      {/* task: a function that checks whether the user is logged in, 
      // to route them to either login page or the homepage */}
      <BrowserRouter>
        <Routes>
          {/* https://luto.com/login */}
          <Route path="/auth" element={<Auth/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

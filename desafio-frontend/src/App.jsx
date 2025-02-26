import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/';
import Orders from './pages/Orders';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/orders' element={<Orders />} />
      </Routes>
    </Router>
  );
}

export default App;

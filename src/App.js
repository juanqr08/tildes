import logo from './logo.svg';
import './App.scss';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VerifyTildes from './components/VerifyTildes';
import Navbar from './components/shared/Navbar';
import Tildes from './components/Tildes';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Tildes />}/>
          <Route path="/verify" exact element={<VerifyTildes />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

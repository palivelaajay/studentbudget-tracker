import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Firstpage from './Components/login-signup/Firstpage';
import Login from './Components/login-signup/Login';
import GetStarted from './Components/login-signup/GetStarted';
import Profile from "./Components/login-signup/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Firstpage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

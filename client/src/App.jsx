import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen">
        {user && <Navbar user={user} setUser={setUser} />}
        <div className={`container mx-auto px-4 ${user ? 'pt-32 pb-8' : 'py-8'}`}>
          <Routes>
            <Route
              path="/"
              element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/register"
              element={!user ? <Register setUser={setUser} /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/transactions"
              element={user ? <Transactions /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile"
              element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

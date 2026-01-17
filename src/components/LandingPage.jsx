import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

function LandingPage() {
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedIn");
    if (loggedInUser) {
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const user = await login(loginIdentifier, password);
      localStorage.setItem("loggedIn", JSON.stringify(user));
      navigate('/home');
    } catch (error) {
      if (error.response?.status === 401) {
        alert('Invalid credentials');
      } else {
        alert('Login failed. Please try again.');
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input 
        type="text" 
        placeholder="Username or Email" 
        value={loginIdentifier} 
        onChange={(e) => setLoginIdentifier(e.target.value)} 
      />
      <br />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <br />
      <hr />
      <button onClick={handleLogin}>Login</button>
      <br />
      <button onClick={() => navigate('/signup')}>Sign Up</button>
    </div>
  );
}

export default LandingPage;
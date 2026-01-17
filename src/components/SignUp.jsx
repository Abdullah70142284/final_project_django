import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/api';

function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedIn");
    if (loggedInUser) {
      navigate("/home");
    }
  }, [navigate]);
  
  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    try {
      const user = await signup(username, email, password);
      localStorage.setItem('loggedIn', JSON.stringify(user));
      navigate('/home');
    } catch (error) {
      if (error.response?.data) {
        const errors = error.response.data;
        if (errors.username) {
          alert(`Username: ${errors.username[0]}`);
        } else if (errors.email) {
          alert(`Email: ${errors.email[0]}`);
        } else {
          alert('Signup failed. Please try again.');
        }
      } else {
        alert('Network error. Please check your connection.');
      }
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <br />
      <button onClick={handleSignUp}>Sign Up</button>
      <br />
      <button onClick={() => navigate('/')}>Back to Login</button>
    </div>
  );
}

export default SignUp;

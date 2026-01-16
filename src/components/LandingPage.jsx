// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// function LandingPage() {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = () => {
//     const users = JSON.parse(localStorage.getItem('users')) || [];
//     const user = users.find(u => u.username === username && u.email ===email && u.password === password);
//     if (user) {
//       navigate('/home');
//     } else {
//       alert('Invalid credentials');
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <input
//         type="text"
//         placeholder="Username or Email"
//         value={username && email}
//         onChange={(e) => setUsername(e.target.value) && setEmail(e.target.value)}
//       />
//       <br />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <br />
//       <hr />
//       <button onClick={handleLogin}>Login</button>
//       <br />
//       <button onClick={() => navigate('/signup')}>Sign Up</button>
//     </div>
//   );
// }

// export default LandingPage;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
      const loggedInUser = localStorage.getItem("loggedIn");
      if (loggedInUser) {
        navigate("/home");
      }
    }, [navigate]);

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => 
      (u.username === loginIdentifier || u.email === loginIdentifier) && 
      u.password === password
    );

    if (user) {
      localStorage.setItem("loggedIn",JSON.stringify(user));
      navigate('/home');
    } else {
      alert('Invalid credentials');
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
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAxios } from '../hooks/useAxios';

// import { useState, useEffect } from 'react';
export default function login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { post } = useAxios();

  const handleLogin = async () => {
    try {
      const response = await post('/api/user/login', { email, password });
      console.log(response);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button onClick={handleLogin}>Login</button>
      </form>
    </div>
  );
}

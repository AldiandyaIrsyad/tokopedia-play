import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAxios } from '../hooks/useAxios';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { post } = useAxios();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const { data } = await post('/api/user/register', {
        username,
        email,
        password,
      });

      if (data) {
        console.log(data);

        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

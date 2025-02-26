import { useState } from 'react';
import axios from 'axios';
import { API_ROUTES } from '@/api';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        API_ROUTES.LOGIN,
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        navigate('/orders');
      } else {
        alert('Login falhou');
      }
    } catch (error) {
      alert('Login falhou');
      throw new Error(error);
    }
  };

  return (
    <>
      <h1 className='app-title'>Festival Feng</h1>
      <div className='login-container'>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className='input-container'>
            <FaUser />
            <input
              type='email'
              placeholder='E-mail'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='input-container'>
            <FaLock />
            <input
              type='password'
              placeholder='Senha'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type='submit'>Entrar</button>
        </form>
      </div>
    </>
  );
}
